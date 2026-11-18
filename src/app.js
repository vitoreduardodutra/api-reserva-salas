require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API de Reserva de Salas está funcionando.' });
});

app.use('/api', authRoutes);
app.use('/api/rooms', roomRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Rota não encontrada.' });
});

app.use(errorHandler);

module.exports = app;
