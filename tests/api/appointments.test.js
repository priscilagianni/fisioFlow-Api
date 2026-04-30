const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Appointments API', () => {

  let patientId;
  let testDate;

  beforeEach(async () => {
    await request(app).delete('/test/reset');

    const date = new Date();
    date.setDate(date.getDate() + 1);
    testDate = date.toISOString().split('T')[0];

    const res = await request(app)
      .post('/patients')
      .send({
        name: 'Paciente Teste',
        age: 30
      });

    patientId = res.body.id;
  });

  it('deve criar agendamento', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '08:00',
        duration: 60
      });

    expect(res.status).to.equal(201);
  });

  it('deve falhar com campos faltando', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({});

    expect(res.status).to.equal(400);
  });

  it('deve detectar conflito de horário (409)', async () => {

    await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '08:00',
        duration: 60
      });

    const res = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '08:30',
        duration: 60
      });

    expect(res.status).to.equal(409);
  });

  it('deve permitir agendamento sem conflito', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '10:00',
        duration: 30
      });

    expect(res.status).to.equal(201);
  });

  it('deve falhar com duração zero', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '08:00',
        duration: 0
      });

    expect(res.status).to.equal(400);
  });

  it('deve falhar com horário inválido', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '25:00',
        duration: 60
      });

    expect(res.status).to.equal(400);
  });

  it('deve retornar 404 para paciente inexistente', async () => {
    const res = await request(app)
      .post('/appointments')
      .send({
        patientId: 999,
        date: testDate,
        startTime: '08:00',
        duration: 60
      });

    expect(res.status).to.equal(404);
  });

  it('deve listar agendamentos por dia', async () => {
    const res = await request(app)
      .get(`/appointments/day/${testDate}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
  });

});