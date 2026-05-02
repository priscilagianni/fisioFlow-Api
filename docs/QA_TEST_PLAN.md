# QA Test Plan - FisioFlow

| Propriedade     | Valor |
|-----------------|-------|
| Versão          | 3.0 |
| Ambiente        | API local (desenvolvimento) |
| Tipo de testes  | Funcionais, validação de regras de negócio e regressão |
| Ferramentas     | Postman, Cypress |

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

| Recurso         | Descrição |
|-----------------|-----------|
| URL             | http://localhost:3000 |
| Banco de dados  | Em memória (reset a cada execução) |
| Testes          | Independentes entre si |
| Ferramentas     | Postman (manual) e Cypress (automação) |

---

## Casos de Teste

### Pacientes

#### CT01 - Criar paciente válido

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US01 |
| Status esperado | 201 Created |
| Validações | Retorna id; paciente criado com sucesso |

#### CT02 - Listar pacientes

| Campo | Valor |
|------|------|
| Severidade | Baixa |
| Tipo | Funcional |
| US | US02 |
| Status esperado | 200 OK |
| Validações | Retorna array de pacientes |

#### CT03 - Criar paciente sem nome

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US01 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Patient name is required` |

#### CT04 - Idade inválida (0 ou negativa)

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US01 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Invalid age` |

#### CT05 - Idade acima do limite

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US01 |
| Status esperado | 400 Bad Request |
| Validações | Mensagem: `Invalid age` |

#### CT06 - Atualizar paciente (PATCH)

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US03 |
| Status esperado | 200 OK |
| Validações | Atualização parcial aplicada |

#### CT07 - Excluir paciente existente

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US04 |
| Status esperado | 200 OK |
| Validações | Paciente e agendamentos removidos |

#### CT08 - Excluir paciente inexistente

| Campo | Valor |
|------|------|
| Severidade | Médio |
| Tipo | Negativo |
| US | US04 |
| Status esperado | 404 Not Found |
| Validações | Mensagem: `Patient not found` |

---

### Agendamentos

#### CT09 - Criar agendamento válido

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Positivo |
| US | US05 |
| Status esperado | 201 Created |
| Validações | endTime calculado corretamente |

#### CT10 - Campos obrigatórios ausentes

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |
| Validações | Campos obrigatórios faltando |

#### CT11 - Paciente inexistente

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 404 Not Found |

#### CT12 - Conflito de horário

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US06 |
| Regra | newStart < existingEnd AND newEnd > existingStart |
| Status esperado | 409 Conflict |

#### CT13 - Listar agendamentos

| Campo | Valor |
|------|------|
| Severidade | Baixa |
| Tipo | Funcional |
| US | US07 |
| Status esperado | 200 OK |

#### CT14 - Listar por data

| Campo | Valor |
|------|------|
| Severidade | Baixa |
| Tipo | Funcional |
| US | US07 |
| Status esperado | 200 OK |

#### CT15 - Duração zero

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |

#### CT16 - Duração negativa

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |

#### CT17 - Formato de hora inválido

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Exemplo | `25:00` |
| Status esperado | 400 Bad Request |

#### CT18 - Data passada

| Campo | Valor |
|------|------|
| Severidade | Crítico |
| Tipo | Negativo |
| US | US05 |
| Status esperado | 400 Bad Request |

---

## Regras de Negócio

### Pacientes
- Nome obrigatório
- Apenas letras
- Idade entre 1 e 120
- Telefone opcional `(XX) XXXXX-XXXX`

### Agendamentos
- Paciente deve existir
- Duração maior que 0
- Formato de hora HH:MM
- Não permite conflito de horário
- Não permite datas passadas

### Conflito de horário

```txt
newStart < existingEnd AND newEnd > existingStart
```
{
  "message": "Schedule conflict detected"
}

---

## Cobertura de Testes

- CRUD de pacientes
- CRUD de agendamentos
- Validações positivas e negativas
- Boundary testing
- Regras de negócio
- Integração entre entidades
- Conflitos de agenda