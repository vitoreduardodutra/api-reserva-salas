require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
  console.error('Defina JWT_SECRET no arquivo .env antes de iniciar a API.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
