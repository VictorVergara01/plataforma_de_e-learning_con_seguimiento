const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Conectar a MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// El Webhook de Stripe necesita el body crudo (Buffer) para validar la firma,
// por lo que interceptamos esa ruta antes del express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));

// Rutas de subida a S3
app.use('/api/upload', require('./routes/upload'));

// Rutas de Pagos de Stripe
app.use('/api/payments', require('./routes/payments'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor de Express activo en puerto ${PORT}`));
