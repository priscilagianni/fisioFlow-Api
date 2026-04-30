const express = require('express');
const patientController = require('../controllers/patientController');

const router = express.Router();

/**
 * @route POST /patients
 * @description Cria um novo paciente
 */
router.post('/', patientController.createPatient);

/**
 * @route GET /patients
 * @description Lista todos os pacientes
 */
router.get('/', patientController.listPatients);

/**
 * @route DELETE /patients/:id
 * @description Remove um paciente pelo ID
 */
router.delete('/:id', patientController.deletePatient);

/**
 * @route PATCH /patients/:id
 * @description Atualiza parcialmente um paciente
 */
router.patch('/:id', patientController.updatePatient);

module.exports = router;