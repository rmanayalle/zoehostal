const utilDate = require('../util/date.js');
const entityHabitacion = require('../entity/habitacion');
const logicReniec = require('./reniec');

function presupuestar(_tarifa, _checkIn, _checkOut, _fechaInicio, _fechaFinal){
  let dateNowPlus12Hours = new Date();
  dateNowPlus12Hours = new Date(dateNowPlus12Hours.getTime() + 12*60*60*1000);

  let presupuesto = {
    total: 0,
    totalNeedsToBeCashed: 0,
    detalle: []
  };

  if(_fechaFinal<_fechaInicio)return presupuesto;


  let tarifaPerHour = Math.ceil(_tarifa/24);

  // Cobro por horas antes del CheckInt
  /*if(_fechaInicio < utilDate.withCheckFormat(_fechaInicio,_checkIn)){
    let diffHoursToCheckIn = Math.floor(utilDate.diffHours(_fechaInicio,utilDate.withCheckFormat(_fechaInicio,_checkIn)));
    if(diffHoursToCheckIn > 0){
      let temp = {
        fechaInicio: _fechaInicio,
        fechaFinal: utilDate.withCheckFormat(_fechaInicio, _checkIn),
        precio: diffHoursToCheckIn*tarifaPerHour,
        needsToBeCashed: false
      };
      temp.needsToBeCashed = (dateNowPlus12Hours > temp.fechaInicio);
      presupuesto.detalle.push(temp);
      presupuesto.total += diffHoursToCheckIn*tarifaPerHour;
      if(temp.needsToBeCashed === true)presupuesto.totalNeedsToBeCashed += temp.precio;
      _fechaInicio = utilDate.withCheckFormat(_fechaInicio, _checkIn);
    }
  }*/

  if(utilDate.isSameDay(_fechaInicio,_fechaFinal))_fechaFinal = utilDate.withCheckFormat(utilDate.plusOneDay(_fechaInicio),_checkOut);

  while(_fechaInicio < utilDate.withCheckFormat(_fechaFinal, _checkOut)){
    let temp = {
      fechaInicio: _fechaInicio,
      fechaFinal: utilDate.withCheckFormat(utilDate.plusOneDay(_fechaInicio), _checkOut),
      precio: _tarifa,
      needsToBeCashed: false
    };
    temp.needsToBeCashed = (dateNowPlus12Hours > temp.fechaInicio);
    presupuesto.detalle.push(temp);
    presupuesto.total += _tarifa;
    if(temp.needsToBeCashed === true)presupuesto.totalNeedsToBeCashed += temp.precio;
    _fechaInicio = utilDate.withCheckFormat(utilDate.plusOneDay(_fechaInicio), _checkIn);
  }

  if(_fechaFinal > utilDate.withCheckFormat(_fechaFinal,_checkOut)){
    let diffHoursFromCheckOut = Math.floor(utilDate.diffHours(utilDate.withCheckFormat(_fechaFinal,_checkOut),_fechaFinal));
    if(diffHoursFromCheckOut > 0){
      let temp = {
        fechaInicio: utilDate.withCheckFormat(_fechaInicio, _checkOut),
        fechaFinal: _fechaFinal,
        precio: diffHoursFromCheckOut*tarifaPerHour,
        needsToBeCashed: false
      };
      temp.needsToBeCashed = (dateNowPlus12Hours > temp.fechaInicio);
      presupuesto.detalle.push(temp);
      presupuesto.total += diffHoursFromCheckOut*tarifaPerHour;
      if(temp.needsToBeCashed === true)presupuesto.totalNeedsToBeCashed += temp.precio;
    }
  }
  return presupuesto;
}

async function rent(_habitacionNombre, _documentoNacional, _checkIn, _checkOut, _fechaFinal){
  return await entityHabitacion.model.findOne({"nombre": _habitacionNombre}).then(async habitacion => {
    let fechaInicio = new Date();
    let presupuesto = presupuestar(habitacion.tarifa, _checkIn, _checkOut, fechaInicio, _fechaFinal);
    habitacion.estado = "ocupado";
    habitacion.cliente = await logicReniec.getClienteFromReniec(_documentoNacional);
    habitacion.hospedaje = {
      fechaInicio: fechaInicio,
      fechaFinal: _fechaFinal,
      cronologia: presupuesto,
      pago: {
        total: 0,
        detalle: []
      }
    };
    await habitacion.save();
    return habitacion;
  });
}

async function pay(_habitacionNombre, _monto){
  return await entityHabitacion.model.findOne({"nombre": _habitacionNombre}).then(async habitacion => {
    let pagoDetalle = {
      fecha: new Date(),
      monto: _monto
    };
    habitacion.hospedaje.pago.detalle.push(pagoDetalle);
    habitacion.hospedaje.pago.total += _monto;
    await habitacion.save();
    return habitacion;
  });
}

module.exports = {
  presupuestar,
  rent,
  pay
};
