# FisioFlow - API + Frontend

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-blue)](https://expressjs.com/)
[![Cypress](https://img.shields.io/badge/Cypress-14-brightgreen)](https://www.cypress.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#licença)

---

## Sobre o projeto

Sistema fullstack para gerenciamento de pacientes e agendamentos de fisioterapia.

Inclui:

- API REST com validação de regras de negócio  
- Interface web (HTML, CSS e JavaScript)  
- Testes automatizados (API e E2E)  
- Documentação com Swagger  

> Projeto educacional — dados armazenados em memória (não persistem após reiniciar o servidor).

---

## Objetivo

Demonstrar conhecimentos em:

- Desenvolvimento fullstack (Node.js + Frontend)
- Arquitetura em camadas (Routes, Controllers, Services)
- Regras de negócio aplicadas na API
- Testes automatizados (Mocha, Chai, Supertest, Cypress)
- Documentação de API (Swagger)

---

## Requisitos

- Node.js 18+
- npm 9+

---

## Instalação e Configuração

```bash
git clone https://github.com/priscilagianni/fisioFlow.git
cd fisioFlow
npm install
npm run dev
```

Ao executar `npm run dev`, o frontend será aberto automaticamente em **http://localhost:3000**

---

## Como usar

Após executar `npm run dev`:

1. **Frontend** abre automaticamente em: http://localhost:3000
2. **API** disponível em: http://localhost:3000
3. **Swagger (Documentação)**: http://localhost:3000/api-docs

> Se a aba não abrir automaticamente, acesse manualmente: http://localhost:3000

---

## Estrutura do projeto

```
FisioFlow/
├── src/ (Backend)
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── database/
│   └── utils/
│
├── front-end/ (Frontend)
│   └── public/
│       ├── index.html
│       ├── app.js
│       └── styles.css
│
├── cypress/
├── docs/
├── postman/
├── package.json
└── README.md
```


---

## Arquitetura

Request → Routes → Controllers → Services → Response

| Camada       | Responsabilidade              |
|--------------|-------------------------------|
| Routes       | Define endpoints              |
| Controllers  | Requisições HTTP             |
| Services     | Regras de negócio            |
| Database     | Memória em tempo de execução  |

---

## API Endpoints

### Pacientes

- POST /patients → Criar paciente  
- GET /patients → Listar pacientes  
- PATCH /patients/:id → Atualizar paciente  
- DELETE /patients/:id → Remover paciente  

---

### Agendamentos

- POST /appointments → Criar agendamento  
- GET /appointments → Listar agendamentos  
- GET /appointments/day/:date → Agendamentos por dia  

---

## Regras de negócio

### Pacientes

- Nome obrigatório  
- Apenas letras no nome  
- Idade entre 1 e 120 anos  
- Telefone opcional (formato (XX) XXXXX-XXXX)  

---

### Agendamentos

- Paciente deve existir  
- Todos os campos são obrigatórios  
- Duração maior que zero  
- Não pode haver conflito de horário  
- Não permite data passada  

---

### Conflito de horário

Um agendamento não pode ser criado quando o horário informado se sobrepõe a outro agendamento já existente no mesmo dia.

A regra de conflito é:

newStart < existingEnd AND newEnd > existingStart

Se a condição for verdadeira, o sistema bloqueia o agendamento e retorna:

Resposta:
409 Conflict - Schedule conflict detected

---

## Testes

### Tipos

- Testes de API  
- Testes de regras de negócio  
- Testes E2E (Cypress)  

---

### Executar testes

```bash
npm run cy:open
npm run cy:run
```

---

## Troubleshooting

### Porta em uso (Windows)

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F

### Erro no frontend (Failed to fetch)

- Verificar se backend está rodando
- Confirmar URL: http://localhost:3000
- Verificar CORS

---

## Melhorias futuras

- Banco de dados (PostgreSQL ou MongoDB)
- Autenticação JWT
- Docker
- CI/CD com GitHub Actions
- Deploy em nuvem
- Testes de contrato

---

## Tecnologias

### Backend

- Node.js
- Express
- Swagger
- CORS

### Frontend

- HTML
- CSS
- JavaScript

### Testes

- Cypress
- Postman
- Mocha / Chai / Supertest

---

## Autora

Priscila Gianni

---

## Licença

MIT