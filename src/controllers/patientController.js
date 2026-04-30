const patientService = require('../services/patientService');

// Criar paciente
function createPatient(req, res) {
  try {
    const result = patientService.createPatient(req.body);

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message
      });
    }

    return res.status(201).json(result.data);
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}

// Listar pacientes
function listPatients(req, res) {
  try {
    const data = patientService.listPatients();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}

// Deletar paciente
function deletePatient(req, res) {
  try {
    const { id } = req.params;
    const result = patientService.deletePatient(id);

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message
      });
    }

    return res.status(200).json(result.data);
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}

// Atualizar paciente (PATCH)
function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const result = patientService.updatePatient(id, req.body);

    if (result.error) {
      return res.status(result.error.status).json({
        message: result.error.message
      });
    }

    return res.status(200).json(result.data);
  } catch {
    return res.status(500).json({
      message: 'Erro interno do servidor'
    });
  }
}

module.exports = {
  createPatient,
  listPatients,
  deletePatient,
  updatePatient
};