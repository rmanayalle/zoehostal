function ToDate(time){
  return new Date(time);
}

function ToLocaleString(date){
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

function DateToPickerStringFormat(date){
  return date.getFullYear() +
          '-' + pad(date.getMonth() + 1) +
          '-' + pad(date.getDate()) +
          'T' + pad(date.getHours()) +
          ':' + pad(date.getMinutes());
}

export {
  ToDate,
  DateToPickerStringFormat,
  ToLocaleString
}
