require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { Issuer, generators } = require('openid-client');
const path = require('path');

const app = express();

// Config via env
const REGION = process.env.COGNITO_REGION || 'us-east-2';
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-2_8G2DWX7Ju';
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || '3le6n1mleocbbllpoc5unvbbe0';
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET || undefined; // optional if using PKCE
const PORT = process.env.AUTH_SERVER_PORT || 3100;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173/';
const REDIRECT_PATH = process.env.REDIRECT_PATH || '/callback';
const REDIRECT_URI = `http://localhost:${PORT}${REDIRECT_PATH}`;

let client;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'some secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Allow simple CORS for frontend dev to call /me and /logout with credentials
const cors = require('cors');
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Initialize OpenID Client
async function initializeClient() {
  const issuerUrl = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
  const issuer = await Issuer.discover(issuerUrl);
  client = new issuer.Client({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uris: [REDIRECT_URI],
    response_types: ['code'],
  });
  console.log('Discovered issuer %s %O', issuer.issuer, issuer.metadata);
}

initializeClient().catch((err) => {
  console.error('Failed to initialize OpenID client', err);
  process.exit(1);
});

// Middleware to check auth
const checkAuth = (req, res, next) => {
  req.isAuthenticated = !!req.session.userInfo;
  next();
};

// Home route
app.get('/', checkAuth, (req, res) => {
  res.render('home', {
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo,
  });
});

// Start login: use PKCE (recommended)
app.get('/login', (req, res) => {
  const nonce = generators.nonce();
  const state = generators.state();
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);
  console.log('[/login] incoming request', { url: req.originalUrl, query: req.query });

  req.session.nonce = nonce;
  req.session.state = state;
  req.session.codeVerifier = codeVerifier;

  // If electron parameter present, mark this session and remember desired protocol
  if (req.query.electron) {
    req.session.electron = true;
    // Prefer a local_port local callback if the Electron main process provided one.
    if (req.query.local_port) {
      const port = parseInt(req.query.local_port, 10);
      if (!Number.isNaN(port)) {
        req.session.localCallback = `http://127.0.0.1:${port}/oauth-callback`;
        console.log('[/login] marked session for Electron with localCallback=', req.session.localCallback);
      }
    }
    // Legacy/custom-protocol support (kept for installed app flows)
    if (!req.session.localCallback) {
      req.session.protocol = req.query.protocol || 'docbranch';
      console.log('[/login] marked session for Electron, protocol=', req.session.protocol);
    }
  }

  const authUrl = client.authorizationUrl({
    scope: 'openid phone email',
    response_mode: 'query',
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  console.log('Authorization URL (sending user to):', authUrl);

  res.redirect(authUrl);
});

// Callback route
app.get(REDIRECT_PATH, async (req, res) => {
  try {
    console.log('[/callback] incoming callback', { url: req.originalUrl, query: req.query });
    const params = client.callbackParams(req);
    const tokenSet = await client.callback(
      REDIRECT_URI,
      params,
      {
        code_verifier: req.session.codeVerifier,
        nonce: req.session.nonce,
        state: req.session.state,
      }
    );
    console.log('[/callback] tokenSet received: ', { access_token: !!tokenSet.access_token, id_token: !!tokenSet.id_token });

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;
    console.log('[/callback] userInfo:', userInfo && userInfo.email ? { email: userInfo.email } : { userInfoPresent: !!userInfo });

    if (req.session.electron) {
      // If the Electron main provided a loopback local callback, redirect the
      // browser to that local address with tokens so the ephemeral listener in
      // the Electron process can capture them. This avoids relying on OS-level
      // protocol handlers in development.
      if (req.session.localCallback) {
        const redirectUrl = `${req.session.localCallback}?access_token=${encodeURIComponent(
          tokenSet.access_token
        )}&id_token=${encodeURIComponent(tokenSet.id_token)}&state=${encodeURIComponent(
          req.session.state || ''
        )}`;
        // Destroy server-side PKCE data as it's no longer needed
        delete req.session.codeVerifier;
        delete req.session.nonce;
        console.log('[/callback] redirecting to localCallback:', redirectUrl);
        res.redirect(redirectUrl);
        return;
      }

      // Fallback: if a custom protocol was requested, continue to use the
      // JavaScript handoff page which attempts to open the protocol URL.
      if (req.session.protocol) {
        const protocol = req.session.protocol;
        const redirectUrl = `${protocol}://auth?access_token=${encodeURIComponent(
          tokenSet.access_token
        )}&id_token=${encodeURIComponent(tokenSet.id_token)}&state=${encodeURIComponent(
          req.session.state || ''
        )}`;
        delete req.session.codeVerifier;
        delete req.session.nonce;
        const page = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Completing sign-in</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>body{font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;margin:2rem}</style>
  </head>
  <body>
    <h2>Almost there — completing sign-in</h2>
    <p>If your app doesn't open automatically, <a id="openLink" href="${redirectUrl}">click here</a> to continue.</p>
    <script>
      (function() {
        try { window.location = ${JSON.stringify(redirectUrl)}; } catch (e) {}
        setTimeout(function() { try { window.close(); } catch (e) {} }, 2000);
      })();
    </script>
  </body>
</html>`;
        res.set('Content-Type', 'text/html');
        res.send(page);
        return;
      }
    }

    // Normal web flow: redirect to frontend and let frontend call /me to get session user
    console.log('[/callback] redirecting to FRONTEND_URL:', FRONTEND_URL);
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error('Callback error:', err);
    res.redirect(FRONTEND_URL);
  }
});

// Return current user info (session-backed) for browser frontend
app.get('/me', (req, res) => {
  if (req.session && req.session.userInfo) {
    res.json({ authenticated: true, user: req.session.userInfo });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout: clear session and redirect to Cognito logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {});
  // Construct logout URL from discovered metadata
  const logoutEndpoint = client.issuer.metadata.end_session_endpoint;
  // Ask Cognito to return to the frontend with a query flag so the UI can
  // detect the logout completion and navigate to the appropriate hash route.
  // Note: make sure this exact URI (including query) is registered as a
  // valid logout URI in your Cognito app client settings if necessary.
  const logoutRedirect = `${FRONTEND_URL.replace(/\/$/, '')}?logged_out=1`;
  const logoutUrl = `${logoutEndpoint}?client_id=${encodeURIComponent(CLIENT_ID)}&logout_uri=${encodeURIComponent(
    logoutRedirect
  )}`;
  res.redirect(logoutUrl);
});

app.listen(PORT, () => {
  console.log(`Auth server listening on http://localhost:${PORT}`);
  console.log(`Redirect URI registered: ${REDIRECT_URI}`);
});
