const API_URL = '';

const state = {
  patients: [],
  appointments: [],
  toastTimer: null
};

const elements = {
  totalPatients: document.querySelector('#total-patients'),
  totalAppointments: document.querySelector('#total-appointments'),
  patientsList: document.querySelector('#patients-list'),
  appointmentsList: document.querySelector('#appointments-list'),
  appointmentPatient: document.querySelector('#appointment-patient'),
  toast: document.querySelector('#toast'),
  patientForm: document.querySelector('#patient-form'),
  appointmentForm: document.querySelector('#appointment-form'),
  appointmentFilterDate: document.querySelector('#appointment-filter-date')
};

const apiMessages = {
  'Required fields missing': 'Preencha os campos obrigatórios.',
  'Patient name is required': 'O nome do paciente é obrigatório.',
  'Invalid patient name': 'O nome deve conter apenas letras.',
  'Patient age is required': 'A idade do paciente é obrigatória.',
  'Age must be a number': 'A idade deve ser um número.',
  'Invalid age': 'Informe uma idade entre 1 e 120 anos.',
  'Invalid phone format. Use (XX) XXXXX-XXXX': 'Use o telefone no formato (XX) XXXXX-XXXX.',
  'Patient not found': 'Paciente não encontrado.',
  'patientId, date, startTime and duration are required': 'Informe paciente, data, horário e duração.',
  'Invalid date format. Use YYYY-MM-DD': 'Use uma data válida.',
  'Past dates are not allowed': 'Não é possível agendar em datas passadas.',
  'Invalid time format. Use HH:MM': 'Use um horário válido.',
  'Duration must be greater than zero': 'A duração deve ser maior que zero.',
  'Schedule conflict detected': 'Já existe um atendimento nesse intervalo de horário.',
  'Appointment not found': 'Agendamento não encontrado.'
};

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function translateMessage(message) {
  return apiMessages[message] || message || 'Não foi possível concluir a ação.';
}

function showToast(message, type = 'success') {
  elements.toast.textContent = message;
  elements.toast.className = `toast show ${type}`;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    elements.toast.classList.remove('show');
  }, 3500);
}

async function api(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(translateMessage(data && data.message));
  }

  return data;
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function patientName(patientId) {
  const patient = state.patients.find(item => item.id === Number(patientId));
  return patient ? patient.name : `Paciente #${patientId}`;
}

function setLoading(target, message) {
  target.innerHTML = `<div class="loading">${message}</div>`;
}

function renderSummary() {
  elements.totalPatients.textContent = state.patients.length;
  elements.totalAppointments.textContent = state.appointments.length;
}

function renderPatientOptions() {
  if (!state.patients.length) {
    elements.appointmentPatient.innerHTML = '<option value="">Cadastre um paciente primeiro</option>';
    elements.appointmentPatient.disabled = true;
    return;
  }

  elements.appointmentPatient.disabled = false;
  elements.appointmentPatient.innerHTML = '<option value="">Selecione um paciente</option>' + state.patients
    .map(patient => `<option value="${patient.id}">${escapeHtml(patient.name)}</option>`)
    .join('');
}

function renderPatients() {
  renderSummary();
  renderPatientOptions();

  if (!state.patients.length) {
    elements.patientsList.innerHTML = '<div class="empty">Nenhum paciente cadastrado ainda.</div>';
    return;
  }

  elements.patientsList.innerHTML = state.patients.map(patient => `
    <article class="item">
      <div class="item-header">
        <div>
          <h3>${escapeHtml(patient.name)}</h3>
          <p>${patient.age} anos - ${escapeHtml(patient.phone || 'Sem telefone')}</p>
          <p>${escapeHtml(patient.diagnosis || 'Sem diagnóstico informado')}</p>
        </div>
        <div class="item-actions">
          <button class="button secondary" type="button" data-edit-patient="${patient.id}">Editar</button>
          <button class="button danger" type="button" data-delete-patient="${patient.id}">Excluir</button>
        </div>
      </div>
    </article>
  `).join('');
}

function renderAppointments() {
  renderSummary();

  if (!state.appointments.length) {
    elements.appointmentsList.innerHTML = '<div class="empty">Nenhum agendamento cadastrado ainda.</div>';
    return;
  }

  const sorted = [...state.appointments].sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`));

  elements.appointmentsList.innerHTML = sorted.map(appointment => `
    <article class="item">
      <div class="item-header">
        <div>
          <h3>${escapeHtml(patientName(appointment.patientId))}</h3>
          <p>${formatDate(appointment.date)} - ${appointment.startTime} às ${appointment.endTime}</p>
          <p>Duração: ${appointment.duration} minutos</p>
        </div>
        <div class="item-actions">
          <button class="button secondary" type="button" data-edit-appointment="${appointment.id}">Editar</button>
          <button class="button danger" type="button" data-delete-appointment="${appointment.id}">Cancelar</button>
        </div>
      </div>
    </article>
  `).join('');
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function resetPatientForm() {
  elements.patientForm.reset();
  document.querySelector('#patient-id').value = '';
}

function resetAppointmentForm() {
  elements.appointmentForm.reset();
  document.querySelector('#appointment-id').value = '';
  document.querySelector('#appointment-duration').value = 60;
}

async function loadPatients() {
  setLoading(elements.patientsList, 'Carregando pacientes...');

  try {
    state.patients = await api('/patients');
    renderPatients();
  } catch (error) {
    elements.patientsList.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
  }
}

async function loadAppointments() {
  setLoading(elements.appointmentsList, 'Carregando agendamentos...');
  const date = elements.appointmentFilterDate.value;
  const path = date ? `/appointments/day/${date}` : '/appointments';

  try {
    state.appointments = await api(path);
    renderAppointments();
  } catch (error) {
    elements.appointmentsList.innerHTML = `<div class="error">${escapeHtml(error.message)}</div>`;
  }
}

async function savePatient(event) {
  event.preventDefault();
  const id = document.querySelector('#patient-id').value;
  const payload = {
    name: document.querySelector('#patient-name').value.trim(),
    phone: document.querySelector('#patient-phone').value.trim(),
    age: Number(document.querySelector('#patient-age').value),
    diagnosis: document.querySelector('#patient-diagnosis').value.trim()
  };

  try {
    await api(id ? `/patients/${id}` : '/patients', {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(payload)
    });
    showToast(id ? 'Paciente atualizado com sucesso.' : 'Paciente cadastrado com sucesso.');
    resetPatientForm();
    await loadPatients();
    await loadAppointments();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function saveAppointment(event) {
  event.preventDefault();
  const id = document.querySelector('#appointment-id').value;
  const payload = {
    patientId: Number(document.querySelector('#appointment-patient').value),
    date: document.querySelector('#appointment-date').value,
    startTime: document.querySelector('#appointment-time').value,
    duration: Number(document.querySelector('#appointment-duration').value)
  };

  try {
    await api(id ? `/appointments/${id}` : '/appointments', {
      method: id ? 'PATCH' : 'POST',
      body: JSON.stringify(payload)
    });
    showToast(id ? 'Agendamento atualizado com sucesso.' : 'Agendamento criado com sucesso.');
    resetAppointmentForm();
    await loadAppointments();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function editPatient(id) {
  const patient = state.patients.find(item => item.id === Number(id));
  if (!patient) return;

  document.querySelector('#patient-id').value = patient.id;
  document.querySelector('#patient-name').value = patient.name;
  document.querySelector('#patient-phone').value = formatPhone(patient.phone || '');
  document.querySelector('#patient-age').value = patient.age;
  document.querySelector('#patient-diagnosis').value = patient.diagnosis || '';
  document.querySelector('#pacientes').scrollIntoView({ behavior: 'smooth' });
}

function editAppointment(id) {
  const appointment = state.appointments.find(item => item.id === Number(id));
  if (!appointment) return;

  document.querySelector('#appointment-id').value = appointment.id;
  document.querySelector('#appointment-patient').value = appointment.patientId;
  document.querySelector('#appointment-date').value = appointment.date;
  document.querySelector('#appointment-time').value = appointment.startTime;
  document.querySelector('#appointment-duration').value = appointment.duration;
  document.querySelector('#agendamentos').scrollIntoView({ behavior: 'smooth' });
}

async function deletePatient(id) {
  if (!window.confirm('Deseja excluir este paciente? Os agendamentos dele também serão removidos.')) return;

  try {
    await api(`/patients/${id}`, { method: 'DELETE' });
    showToast('Paciente excluído com sucesso.');
    await loadPatients();
    await loadAppointments();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function deleteAppointment(id) {
  if (!window.confirm('Deseja cancelar este agendamento?')) return;

  try {
    await api(`/appointments/${id}`, { method: 'DELETE' });
    showToast('Agendamento cancelado com sucesso.');
    await loadAppointments();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function bindEvents() {
  document.querySelector('#patient-phone').addEventListener('input', event => {
    event.target.value = formatPhone(event.target.value);
  });

  elements.patientForm.addEventListener('submit', savePatient);
  elements.appointmentForm.addEventListener('submit', saveAppointment);
  document.querySelector('#cancel-patient-edit').addEventListener('click', resetPatientForm);
  document.querySelector('#cancel-appointment-edit').addEventListener('click', resetAppointmentForm);
  document.querySelector('#refresh-patients').addEventListener('click', loadPatients);
  document.querySelector('#refresh-appointments').addEventListener('click', loadAppointments);
  elements.appointmentFilterDate.addEventListener('change', loadAppointments);

  document.addEventListener('click', event => {
    const editPatientId = event.target.dataset.editPatient;
    const deletePatientId = event.target.dataset.deletePatient;
    const editAppointmentId = event.target.dataset.editAppointment;
    const deleteAppointmentId = event.target.dataset.deleteAppointment;

    if (editPatientId) editPatient(editPatientId);
    if (deletePatientId) deletePatient(deletePatientId);
    if (editAppointmentId) editAppointment(editAppointmentId);
    if (deleteAppointmentId) deleteAppointment(deleteAppointmentId);
  });
}

async function init() {
  bindEvents();
  await loadPatients();
  await loadAppointments();
}

init();
