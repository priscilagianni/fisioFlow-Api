const express = require('express');
const cors = require('cors');
const path = require('path');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

const { db, resetDatabase } = require('./database/inMemoryDatabase');

const app = express();

const swaggerDocument = YAML.load(
  path.join(__dirname, '..', 'docs', 'swagger.yaml')
);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'front-end', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'front-end', 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({
    name: 'FisioFlow API',
    status: 'online'
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);

app.delete('/test/reset', (req, res) => {
  resetDatabase();
  return res.status(200).json({
    message: 'Banco resetado com sucesso'
  });
});

app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor'
  });
});

module.exports = app;
