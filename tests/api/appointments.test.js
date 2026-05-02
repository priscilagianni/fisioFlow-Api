const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Appointments API', () => {

  let patientId;
  let appointmentId;
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
    expect(res.body.message).to.equal('Schedule conflict detected');
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
    await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '08:00',
        duration: 60
      });

    const res = await request(app)
      .get(`/appointments/day/${testDate}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.every(a => a.date === testDate)).to.be.true;
  });

  it('CT21 - deve atualizar agendamento com sucesso', async () => {
    const created = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '09:00',
        duration: 45
      });

    appointmentId = created.body.id;

    const res = await request(app)
      .patch(`/appointments/${appointmentId}`)
      .send({ duration: 30 });

    expect(res.status).to.equal(200);
    expect(res.body.duration).to.equal(30);
  });

  it('CT22 - deve retornar 404 ao atualizar agendamento inexistente', async () => {
    const res = await request(app)
      .patch('/appointments/999')
      .send({ duration: 30 });

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Appointment not found');
  });

  it('CT23 - deve retornar 409 ao atualizar agendamento gerando conflito', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 2);
    const conflictDate = futureDate.toISOString().split('T')[0];

    await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: conflictDate,
        startTime: '08:00',
        duration: 60
      });

    const second = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: conflictDate,
        startTime: '10:00',
        duration: 60
      });

    appointmentId = second.body.id;

    const res = await request(app)
      .patch(`/appointments/${appointmentId}`)
      .send({ startTime: '08:30' });

    expect(res.status).to.equal(409);
    expect(res.body.message).to.equal('Schedule conflict detected');
  });

  it('CT24 - deve excluir agendamento com sucesso', async () => {
    const created = await request(app)
      .post('/appointments')
      .send({
        patientId,
        date: testDate,
        startTime: '11:00',
        duration: 30
      });

    appointmentId = created.body.id;

    const res = await request(app)
      .delete(`/appointments/${appointmentId}`);

    expect(res.status).to.equal(200);
    expect(res.body.message).to.equal('Appointment deleted successfully');
  });

  it('CT25 - deve retornar 404 ao excluir agendamento inexistente', async () => {
    const res = await request(app)
      .delete('/appointments/999');

    expect(res.status).to.equal(404);
    expect(res.body.message).to.equal('Appointment not found');
  });

});