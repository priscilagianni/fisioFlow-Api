describe('FisioFlow API - Testes Automatizados Críticos', () => {

  let patientId;

  function getFutureDate(days = 1) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  beforeEach(() => {
    cy.request('DELETE', '/test/reset');
    cy.request('POST', '/patients', {
      name: 'Paciente Base',
      phone: '(85) 98888-7777',
      age: 30,
      diagnosis: 'Avaliação inicial'
    }).then((res) => {
      patientId = res.body.id;
    });
  });

  describe('Pacientes', () => {

    it('deve criar paciente com sucesso', () => {
      cy.request('POST', '/patients', {
        name: 'Maria Souza',
        phone: '(85) 99999-0000',
        age: 35,
        diagnosis: 'Dor muscular'
      }).then((res) => {
        expect(res.status).to.eq(201);
      });
    });

    it('deve falhar ao criar paciente sem nome', () => {
      cy.request({
        method: 'POST',
        url: '/patients',
        failOnStatusCode: false,
        body: { age: 20 }
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

    it('deve listar pacientes', () => {
      cy.request('GET', '/patients').then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.be.an('array');
      });
    });

    it('deve atualizar paciente', () => {
      cy.request('PATCH', `/patients/${patientId}`, {
        name: 'Nome Atualizado'
      }).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

    it('deve deletar paciente', () => {
      cy.request('DELETE', `/patients/${patientId}`).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

  });

  describe('Agendamentos', () => {

    it('deve criar agendamento com sucesso', () => {
      cy.request('POST', '/appointments', {
        patientId,
        date: getFutureDate(1),
        startTime: '08:00',
        duration: 60
      }).then((res) => {
        expect(res.status).to.eq(201);
      });
    });

    it('deve falhar ao criar agendamento com campos obrigatórios ausentes', () => {
      cy.request({
        method: 'POST',
        url: '/appointments',
        failOnStatusCode: false,
        body: {}
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

    it('deve detectar conflito de horário', () => {
      const date = getFutureDate(2);

      cy.request('POST', '/appointments', {
        patientId,
        date,
        startTime: '08:00',
        duration: 60
      }).then(() => {
        cy.request({
          method: 'POST',
          url: '/appointments',
          failOnStatusCode: false,
          body: { patientId, date, startTime: '08:30', duration: 60 }
        }).then((res) => {
          expect(res.status).to.eq(409);
        });
      });
    });

    it('deve permitir agendamento sem conflito', () => {
      cy.request('POST', '/appointments', {
        patientId,
        date: getFutureDate(3),
        startTime: '10:00',
        duration: 30
      }).then((res) => {
        expect(res.status).to.eq(201);
      });
    });

    it('deve listar agendamentos por dia', () => {
      cy.request('GET', `/appointments/day/${getFutureDate(1)}`).then((res) => {
        expect(res.status).to.eq(200);
      });
    });

  });

  describe('Validações críticas', () => {

    it('deve falhar com duração zero', () => {
      cy.request({
        method: 'POST',
        url: '/appointments',
        failOnStatusCode: false,
        body: { patientId, date: getFutureDate(1), startTime: '08:00', duration: 0 }
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

    it('deve bloquear agendamento em data passada', () => {
      cy.request({
        method: 'POST',
        url: '/appointments',
        failOnStatusCode: false,
        body: { patientId, date: '2020-04-10', startTime: '08:00', duration: 60 }
      }).then((res) => {
        expect(res.status).to.eq(400);
      });
    });

  });

});