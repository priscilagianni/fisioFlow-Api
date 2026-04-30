const express = require('express');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

/**
 * @route POST /appointments
 * @description Cria um novo atendimento
 */
router.post('/', appointmentController.createAppointment);

/**
 * @route GET /appointments
 * @description Lista todos os atendimentos
 */
router.get('/', appointmentController.listAppointments);

/**
 * @route GET /appointments/day/:date
 * @description Lista atendimentos por data (YYYY-MM-DD)
 */
router.get('/day/:date', appointmentController.listAppointmentsByDate);

/**
 * @route PATCH /appointments/:id
 * @description Atualiza parcialmente um atendimento
 */
router.patch('/:id', appointmentController.updateAppointment);

/**
 * @route DELETE /appointments/:id
 * @description Remove um atendimento pelo ID
 */
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
