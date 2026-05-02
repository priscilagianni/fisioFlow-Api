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
- Testes automatizados de API e E2E
- Documentação com Swagger

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

---

## Instalação

```bash
git clone https://github.com/priscilagianni/fisioFlow-Api.git
cd fisioFlow-Api
npm install
npm run dev
```

Após iniciar:

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api-docs

---

## Executando testes

```bash
# Abrir Cypress no modo interativo
npm run cy:open

# Rodar testes em modo headless
npm run cy:run

# Rodar testes de API
npm run test:api
```

---

## Estrutura do projeto

fisioFlow-Api/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── database/
│   └── utils/
├── front-end/
│   └── public/
│       ├── index.html
│       ├── app.js
│       └── styles.css
├── cypress/
├── docs/
├── postman/
├── .env.example
├── cypress.config.js
├── package.json
└── README.md

---

## Arquitetura
Request → Routes → Controllers → Services → Response

| Camada | Responsabilidade |
|---|---|
| Routes | Define os endpoints |
| Controllers | Processa requisições HTTP |
| Services | Aplica as regras de negócio |
| Database | Armazenamento em memória (runtime) |

---

## Endpoints

### Pacientes

| Método | Rota | Descrição |
|---|---|---|
| POST | /patients | Criar paciente |
| GET | /patients | Listar pacientes |
| PATCH | /patients/:id | Atualizar paciente |
| DELETE | /patients/:id | Remover paciente |

### Agendamento

| Método | Rota | Descrição |
|--------|------|------------|
| POST   | /appointments | Criar agendamento |
| GET    | /appointments | Listar agendamentos |
| GET    | /appointments/day/:date | Agendamentos por dia |
| PATCH  | /appointments/:id | Atualizar agendamento |
| DELETE | /appointments/:id | Remover agendamento |

### Utilitário (testes)

| Método | Rota | Descrição |
|---|---|---|
| DELETE | /test/reset | Resetar dados em memória |

---

## Regras de negócio

### Pacientes

- Nome obrigatório (somente letras)
- Idade entre 1 e 120 anos
- Telefone opcional
- Diagnóstico opcional

### Agendamentos

- Paciente deve existir
- Todos os campos são obrigatórios
- Duração maior que zero
- Não permite data passada
- Não permite conflito de horário

**Regra de conflito:**

- Um agendamento é bloqueado quando o horário informado se sobrepõe a outro já existente no mesmo dia, retornando 409 Conflict.
---

## Tecnologias

### Backend

- Node.js
- Express
- Swagger UI Express + YAML JS
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

## Troubleshooting

**Porta em uso (Windows)**

```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Erro: Failed to fetch**

- Verificar se o backend está rodando
- Confirmar URL: http://localhost:3000
- Verificar CORS

---

## Melhorias futuras

- Banco de dados (PostgreSQL ou MongoDB) — atualmente os dados são armazenados em memória
- Autenticação JWT
- Docker
- CI/CD com GitHub Actions
- Deploy em nuvem
- Testes de contrato

---

## Autora

Priscila Gianni

---

## Licença

MIT