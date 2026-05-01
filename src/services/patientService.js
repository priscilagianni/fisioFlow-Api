const { db, getNextId } = require('../database/inMemoryDatabase');

// ==========================
// VALIDATION HELPERS
// ==========================
function isValidPatientName(name) {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(name);
}

function isValidPhone(phone) {
  return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(phone);
}

// CREATE PATIENT

function createPatient(data) {
  if (!data) {
    return { error: { status: 400, message: 'Required fields missing' } };
  }

  const name = (data.name || '').trim();

  if (!name) {
    return { error: { status: 400, message: 'Patient name is required' } };
  }

  if (!isValidPatientName(name)) {
    return { error: { status: 400, message: 'Invalid patient name' } };
  }


  // AGE NORMALIZATION (FIX PRINCIPAL)
 
  const ageNumber = Number(data.age);

  if (data.age === undefined || data.age === null || data.age === '') {
    return { error: { status: 400, message: 'Patient age is required' } };
  }

  if (isNaN(ageNumber)) {
    return { error: { status: 400, message: 'Age must be a number' } };
  }

  if (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 120) {
    return { error: { status: 400, message: 'Invalid age' } };
  }

  // PHONE
  if (data.phone && !isValidPhone(data.phone)) {
    return {
      error: {
        status: 400,
        message: 'Invalid phone format. Use (XX) XXXXX-XXXX'
      }
    };
  }

  const patient = {
    id: getNextId('patients'),
    name,
    phone: data.phone || '',
    age: ageNumber,
    diagnosis: data.diagnosis || '',
    createdAt: new Date().toISOString()
  };

  db.patients.push(patient);

  return { data: patient };
}

// LIST PATIENTS

function listPatients() {
  return db.patients;
}

// DELETE PATIENT

function deletePatient(id) {
  const index = db.patients.findIndex(p => p.id === Number(id));

  if (index === -1) {
    return { error: { status: 404, message: 'Patient not found' } };
  }

  db.patients.splice(index, 1);

  db.appointments = db.appointments.filter(
    a => a.patientId !== Number(id)
  );

  return {
    data: {
      message: 'Patient deleted successfully'
    }
  };
}

// UPDATE PATIENT (PATCH)

function updatePatient(id, data) {
  const patient = db.patients.find(p => p.id === Number(id));

  if (!patient) {
    return { error: { status: 404, message: 'Patient not found' } };
  }

  // NAME
  if (data.name !== undefined) {
    const name = (data.name || '').trim();

    if (!name) {
      return { error: { status: 400, message: 'Patient name is required' } };
    }

    if (!isValidPatientName(name)) {
      return { error: { status: 400, message: 'Invalid patient name' } };
    }

    patient.name = name;
  }

  // PHONE
  if (data.phone !== undefined) {
    const phone = (data.phone || '').trim();

    if (phone && !isValidPhone(phone)) {
      return {
        error: {
          status: 400,
          message: 'Invalid phone format. Use (XX) XXXXX-XXXX'
        }
      };
    }

    patient.phone = phone;
  }

  // AGE 
  if (data.age !== undefined) {
    const ageNumber = Number(data.age);

    if (isNaN(ageNumber)) {
      return { error: { status: 400, message: 'Age must be a number' } };
    }

    if (!Number.isInteger(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      return { error: { status: 400, message: 'Invalid age' } };
    }

    patient.age = ageNumber;
  }

  // DIAGNOSIS
  if (data.diagnosis !== undefined) {
    patient.diagnosis = (data.diagnosis || '').trim();
  }

  return { data: patient };
}

module.exports = {
  createPatient,
  listPatients,
  deletePatient,
  updatePatient
};