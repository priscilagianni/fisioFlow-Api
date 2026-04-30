const { db, getNextId } = require('../database/inMemoryDatabase');
const { convertTimeToMinutes, convertMinutesToTime } = require('../utils/timeUtils');

function validateAppointmentPayload(data, currentId) {
  const { patientId, date, startTime, duration } = data;

  if (!patientId || !date || !startTime || duration === undefined) {
    return {
      error: {
        status: 400,
        message: 'patientId, date, startTime and duration are required'
      }
    };
  }

  const patientExists = db.patients.some(p => p.id === Number(patientId));

  if (!patientExists) {
    return {
      error: {
        status: 404,
        message: 'Patient not found'
      }
    };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(date)) {
    return {
      error: {
        status: 400,
        message: 'Invalid date format. Use YYYY-MM-DD'
      }
    };
  }

  const [year, month, day] = date.split('-').map(Number);
  const inputDate = new Date(year, month - 1, day);
  inputDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate.getTime() < today.getTime()) {
    return {
      error: {
        status: 400,
        message: 'Past dates are not allowed'
      }
    };
  }

  const start = convertTimeToMinutes(startTime);

  if (start === null) {
    return {
      error: {
        status: 400,
        message: 'Invalid time format. Use HH:MM'
      }
    };
  }

  const dur = Number(duration);

  if (!Number.isInteger(dur) || dur <= 0) {
    return {
      error: {
        status: 400,
        message: 'Duration must be greater than zero'
      }
    };
  }

  const newEnd = start + dur;
  const hasConflict = db.appointments.some(a => {
    if (a.id === Number(currentId)) return false;
    if (a.date !== date) return false;

    const aStart = convertTimeToMinutes(a.startTime);
    const aEnd = aStart + Number(a.duration);

    return start < aEnd && newEnd > aStart;
  });

  if (hasConflict) {
    return {
      error: {
        status: 409,
        message: 'Schedule conflict detected'
      }
    };
  }

  return {
    data: {
      patientId: Number(patientId),
      date,
      startTime,
      duration: dur,
      endTime: convertMinutesToTime(newEnd)
    }
  };
}

function createAppointment(data) {
  const result = validateAppointmentPayload(data || {});

  if (result.error) {
    return result;
  }

  const appointment = {
    id: getNextId('appointments'),
    ...result.data,
    createdAt: new Date().toISOString()
  };

  db.appointments.push(appointment);

  return { data: appointment };
}

function listAppointments() {
  return db.appointments;
}

function listAppointmentsByDate(date) {
  return db.appointments.filter(a => a.date === date);
}

function updateAppointment(id, data) {
  const appointment = db.appointments.find(a => a.id === Number(id));

  if (!appointment) {
    return { error: { status: 404, message: 'Appointment not found' } };
  }

  const nextData = {
    patientId: data.patientId !== undefined ? data.patientId : appointment.patientId,
    date: data.date !== undefined ? data.date : appointment.date,
    startTime: data.startTime !== undefined ? data.startTime : appointment.startTime,
    duration: data.duration !== undefined ? data.duration : appointment.duration
  };

  const result = validateAppointmentPayload(nextData, id);

  if (result.error) {
    return result;
  }

  Object.assign(appointment, result.data);

  return { data: appointment };
}

function deleteAppointment(id) {
  const index = db.appointments.findIndex(a => a.id === Number(id));

  if (index === -1) {
    return { error: { status: 404, message: 'Appointment not found' } };
  }

  db.appointments.splice(index, 1);

  return {
    data: {
      message: 'Appointment deleted successfully'
    }
  };
}

module.exports = {
  createAppointment,
  listAppointments,
  listAppointmentsByDate,
  updateAppointment,
  deleteAppointment
};
