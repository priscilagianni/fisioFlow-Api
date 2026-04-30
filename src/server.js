const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`FisioFlow API rodando em http://localhost:${PORT}`);
  console.log(`Swagger UI disponivel em http://localhost:${PORT}/api-docs`);
});
