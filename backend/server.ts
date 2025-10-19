const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json();
});

app.listen(PORT, () => {
  console.log('Backend server running on port', PORT);
});