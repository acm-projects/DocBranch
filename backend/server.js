const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running', port: PORT });
});

app.listen(PORT, () => {
  console.log('Backend server running on port', PORT);
});