const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Patients API', () => {

  let patientId;

  beforeEach(async () => {
    await request(app).delete('/test/reset');

    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Maria Souza',
        phone: '(85) 99999-0000',
        age: 35
      });

    patientId = res.body.id;
  });

  it('CT01 - deve criar paciente com sucesso', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        name: 'João Silva',
        phone: '(85) 99999-0000',
        age: 35
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
    expect(res.body.name).to.equal('João Silva');
  });

  it('CT03 - deve falhar quando nome está ausente', async () => {
    const res = await request(app)
      .post('/patients')
      .send({ age: 20 });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Patient name is required');
  });

  it('CT04 - deve falhar com idade inválida (0 ou negativa)', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Maria',
        age: 0
      });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Invalid age');
  });

  it('CT05 - deve falhar com idade acima de 120', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Maria',
        age: 121
      });

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal('Invalid age');
  });

  it('CT19 - deve criar paciente com idade mínima (1)', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Paciente Jovem',
        age: 1
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('CT20 - deve criar paciente com idade máxima (120)', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Paciente Idoso',
        age: 120
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('CT02 - deve listar pacientes', async () => {
    const res = await request(app).get('/patients');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.greaterThan(0);
  });

  it('CT06 - deve atualizar paciente', async () => {
    const res = await request(app)
      .patch(`/patients/${patientId}`)
      .send({ name: 'Nome Atualizado' });

    expect(res.status).to.equal(200);
    expect(res.body.name).to.equal('Nome Atualizado');
    expect(res.body.age).to.equal(35);
  });

  it('CT07 - deve deletar paciente existente', async () => {
    const res = await request(app)
      .delete(`/patients/${patientId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Patient deleted successfully');
  });

  it('CT08 - deve retornar 404 ao deletar paciente inexistente', async () => {
    const res = await request(app)
      .delete('/patients/999');

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Patient not found');
  });

});