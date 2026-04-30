const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Patients API', () => {

  beforeEach(async () => {
    await request(app).delete('/test/reset');
  });

  it('deve criar paciente com sucesso', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Maria Souza',
        phone: '(85) 99999-0000',
        age: 35
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property('id');
  });

  it('deve falhar quando nome está ausente', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        age: 20
      });

    expect(res.status).to.equal(400);
  });

  it('deve falhar com idade inválida', async () => {
    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Maria',
        age: 0
      });

    expect(res.status).to.equal(400);
  });

  it('deve listar pacientes', async () => {
    const res = await request(app).get('/patients');

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

  it('deve atualizar paciente', async () => {
    const create = await request(app)
      .post('/patients')
      .send({
        name: 'Maria',
        age: 30
      });

    const id = create.body.id;

    const res = await request(app)
      .patch(`/patients/${id}`)
      .send({
        name: 'Nome Atualizado'
      });

    expect(res.status).to.equal(200);
  });

  it('deve deletar paciente', async () => {
    const create = await request(app)
      .post('/patients')
      .send({
        name: 'Maria',
        age: 30
      });

    const id = create.body.id;

    const res = await request(app)
      .delete(`/patients/${id}`);

    expect(res.status).to.equal(200);
  });

});