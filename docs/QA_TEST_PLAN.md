# QA Test Plan - FisioFlow

| Propriedade | Valor |
|-------------|-------|
| Versão | 3.0 |
| Ambiente | API local (desenvolvimento) |
| Tipo de testes | Funcionais, validação de regras de negócio e regressão |
| Ferramentas | Postman, Cypress |

---

## Objetivo

Validar o funcionamento da API FisioFlow, garantindo:

- Integridade no cadastro de pacientes
- Consistência nos agendamentos
- Aplicação correta das regras de negócio
- Validação de entradas (campos obrigatórios, formatos e limites)
- Prevenção de conflitos de agenda

---

## Escopo

### Pacientes

- Criar paciente
- Listar pacientes
- Atualizar paciente (PATCH)
- Excluir paciente
- Validações de campos

### Agendamentos

- Criar agendamento
- Listar agendamentos
- Listar por data
- Atualizar agendamento (PATCH)
- Excluir agendamento
- Regras de conflito de horário
- Validação de campos obrigatórios
- Validação de horários e duração
- Não é permitido agendar em datas passadas

---

## Ambiente de Teste

| Recurso | Descrição |
|---------|-----------|
| URL | http://localhost:3000 |
| Banco de dados | Em memória (reset a cada execução) |
| Testes | Independentes entre si |
| Ferramentas | Postman (manual) e Cypress (automação) |

---

## Casos de Teste

### Pacientes

#### CT01 - Criar paciente válido

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US01 |
| Status esperado | 201 Created |
| Validações | Retorna id; paciente criado com sucesso |

#### CT02 - Listar pacientes

| Campo | Valor |
|-------|-------|
| Severidade | Baixa |
| Tipo | Funcional |
| US | US02 |
| Status esperado | 200 OK |
| Validações | Retorna array de pacientes |

#### CT03 - Criar paciente sem nome

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US01 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Patient name is required` |

#### CT04 - Idade inválida (0 ou negativa)

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US01 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Invalid age` |

#### CT05 - Idade acima do limite (acima de 120)

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US01 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Invalid age` |

#### CT06 - Atualizar paciente (PATCH)

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US03 |
| Status esperado | 200 OK |
| Validações | Atualização parcial aplicada; campos não enviados permanecem inalterados |

#### CT07 - Excluir paciente existente

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US04 |
| Status esperado | 200 OK |
| Validações | Paciente removido; agendamentos associados removidos em cascata |

#### CT08 - Excluir paciente inexistente

| Campo | Valor |
|-------|-------|
| Severidade | Médio |
| Tipo | Negativo |
| US | US04 |
| Status esperado | 404 Not Found |
| Validações | Mensagem: `Patient not found` |

#### CT19 - Idade limite mínima (1)

| Campo | Valor |
|-------|-------|
| Severidade | Médio |
| Tipo | Boundary |
| US | US01 |
| Status esperado | 201 Created |
| Validações | Paciente criado com sucesso |

#### CT20 - Idade limite máxima (120)

| Campo | Valor |
|-------|-------|
| Severidade | Médio |
| Tipo | Boundary |
| US | US01 |
| Status esperado | 201 Created |
| Validações | Paciente criado com sucesso |

---

### Agendamentos

#### CT09 - Criar agendamento válido

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US05 |
| Status esperado | 201 Created |
| Validações | endTime calculado corretamente |

#### CT10 - Campos obrigatórios ausentes

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `patientId, date, startTime and duration are required` |

#### CT11 - Paciente inexistente

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 404 Not Found |
| Validações | Mensagem: `Patient not found` |

#### CT12 - Conflito de horário

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US06 |
| Regra | newStart < existingEnd AND newEnd > existingStart |
| Status esperado | 409 Conflict |
| Validações | Mensagem: `Schedule conflict detected` |

#### CT13 - Listar agendamentos

| Campo | Valor |
|-------|-------|
| Severidade | Baixa |
| Tipo | Funcional |
| US | US07 |
| Status esperado | 200 OK |
| Validações | Retorna array de agendamentos |

#### CT14 - Listar agendamentos por data

| Campo | Valor |
|-------|-------|
| Severidade | Baixa |
| Tipo | Funcional |
| US | US07 |
| Status esperado | 200 OK |
| Validações | Retorna apenas agendamentos da data informada |

#### CT15 - Duração zero

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Duration must be greater than zero` |

#### CT16 - Duração negativa

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Duration must be greater than zero` |

#### CT17 - Formato de hora inválido

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Exemplo | `"startTime": "25:00"` |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Invalid time format. Use HH:MM` |

#### CT18 - Agendamento em data passada

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Past dates are not allowed` |

#### CT21 - Atualizar agendamento com sucesso

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US08 |
| Status esperado | 200 OK |
| Validações | Atualização parcial aplicada; endTime recalculado quando necessário |

#### CT22 - Atualizar agendamento inexistente

| Campo | Valor |
|-------|-------|
| Severidade | Médio |
| Tipo | Negativo |
| US | US08 |
| Status esperado | 404 Not Found |
| Validações | Mensagem: `Appointment not found` |

#### CT23 - Atualizar agendamento gerando conflito de horário

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US08 |
| Status esperado | 409 Conflict |
| Validações | Mensagem: `Schedule conflict detected` |

#### CT24 - Excluir agendamento existente

| Campo | Valor |
|-------|-------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US09 |
| Status esperado | 200 OK |
| Validações | Mensagem: `Appointment deleted successfully` |

#### CT25 - Excluir agendamento inexistente

| Campo | Valor |
|-------|-------|
| Severidade | Médio |
| Tipo | Negativo |
| US | US09 |
| Status esperado | 404 Not Found |
| Validações | Mensagem: `Appointment not found` |

---

## Regras de Negócio

### Pacientes

- Nome obrigatório e apenas com letras
- Idade entre 1 e 120 anos
- Telefone opcional, formato `(XX) XXXXX-XXXX`
- Diagnóstico opcional, sem restrição de formato

### Agendamentos

- Paciente deve existir
- Duração deve ser maior que 0
- Hora no formato `HH:MM`
- Não pode haver conflito de horário
- Datas passadas não são permitidas

---

## Cobertura de Testes

- CRUD completo de pacientes
- CRUD completo de agendamentos
- Validações negativas e positivas
- Boundary testing (limites de valores)
- Regras de negócio críticas
- Integração entre entidades
- Detecção de conflito de agenda