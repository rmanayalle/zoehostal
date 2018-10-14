function zeroDate(fecha){
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    0,
    0,
    0
  );
}

function withCheckFormat(fecha, check){
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    check.getHours(),
    check.getMinutes(),
    check.getSeconds()
  );
}

function plusOneDay(date){
  return new Date(date.getTime() + 24*60*60*1000);
}

function isSameDay(fecha1, fecha2){
  return (fecha1.getFullYear() === fecha2.getFullYear() &&
          fecha1.getMonth() === fecha2.getMonth() &&
          fecha1.getDate() === fecha2.getDate());
}

function diffDays(fechaInicio, fechaFinal){
  let timeDiff = fechaFinal.getTime() - fechaInicio.getTime();
  return timeDiff / (1000 * 3600 * 24);
}

function diffSeconds(fechaInicio, fechaFinal){
  return (fechaFinal.getTime() - fechaInicio.getTime()) / 1000;
}

function diffHours(fechaInicio, fechaFinal){
  let timeDiff = fechaFinal.getTime() - fechaInicio.getTime();
  return timeDiff/(60*60*1000);
}

function toDate(time){
  return new Date(time);
}

function toLocaleString(date){
  let dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };

  return date.toLocaleString("es-ES", dateOptions);
}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

function dateToPickerStringFormat(date){
  return date.getFullYear() +
          '-' + pad(date.getMonth() + 1) +
          '-' + pad(date.getDate()) +
          'T' + pad(date.getHours()) +
          ':' + pad(date.getMinutes());
}

export {
  zeroDate,
  plusOneDay,
  isSameDay,
  diffDays,
  diffSeconds,
  diffHours,
  withCheckFormat,
  toDate,
  dateToPickerStringFormat,
  toLocaleString
}
