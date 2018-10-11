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

function withCheckOutFormat(fecha, checkOut){
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    checkOut.getHours(),
    checkOut.getMinutes(),
    checkOut.getSeconds()
  );
}

function withCheckInFormat(fecha, checkIn){
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    checkIn.getHours(),
    checkIn.getMinutes(),
    checkIn.getSeconds()
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
  let timeDiff = Math.abs(fechaFinal.getTime() - fechaInicio.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function diffSeconds(fechaInicio, fechaFinal){
  return (fechaFinal.getTime() - fechaInicio.getTime()) / 1000;
}

module.exports = {
  zeroDate,
  plusOneDay,
  isSameDay,
  diffDays,
  diffSeconds,
  withCheckInFormat,
  withCheckOutFormat
};
