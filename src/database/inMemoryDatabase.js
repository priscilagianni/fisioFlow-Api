const db = {
  patients: [],
  appointments: [],
  counters: {
    patients: 1,
    appointments: 1
  }
};

// Gera próximo ID da coleção
function getNextId(collectionName) {
  if (!db.counters[collectionName]) {
    throw new Error(`Invalid collection: ${collectionName}`);
  }

  const nextId = db.counters[collectionName];
  db.counters[collectionName] += 1;

  return nextId;
}

// Reseta banco (uso para testes)
function resetDatabase() {
  db.patients.length = 0;
  db.appointments.length = 0;
  db.counters.patients = 1;
  db.counters.appointments = 1;
}

module.exports = {
  db,
  getNextId,
  resetDatabase
};