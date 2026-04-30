function convertTimeToMinutes(time) {
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function convertMinutesToTime(totalMinutes) {
  if (!Number.isInteger(totalMinutes) || totalMinutes < 0) {
    return null;
  }

  const normalizedMinutes = totalMinutes % (24 * 60);
  const hours = String(Math.floor(normalizedMinutes / 60)).padStart(2, '0');
  const minutes = String(normalizedMinutes % 60).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function calculateAppointmentEnd(startTime, duration) {
  const startInMinutes = convertTimeToMinutes(startTime);

  if (startInMinutes === null) {
    return null;
  }

  return startInMinutes + duration;
}

module.exports = {
  convertTimeToMinutes,
  convertMinutesToTime,
  calculateAppointmentEnd
};
