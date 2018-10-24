const utilDate = require('../util/date.js');
const utilGlobal = require('../util/global.js');
const entityHabitacion = require('../entity/habitacion');
const entityHospedaje = require('../entity/hospedaje');
const logicReniec = require('./reniec');
const logicCaja = require('./caja');

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

  let diffHours = Math.floor(utilDate.diffHours(_fechaInicio,_fechaFinal));

  if(diffHours <= 4){
    presupuesto.total = 30,
    presupuesto.totalNeedsToBeCashed = 30,
    presupuesto.detalle.push({
      fechaInicio: _fechaInicio,
      fechaFinal: _fechaFinal,
      precio: 30,
      needsToBeCashed: true
    });
    return presupuesto;
  }

  // Cobro por horas antes del CheckIn
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

    await logicCaja.addCajaHabitacion(_monto, habitacion, habitacion.cliente);
    await habitacion.save();
    return habitacion;
  });
}

async function free(_habitacionNombre){
  return await entityHabitacion.model.findOne({"nombre": _habitacionNombre}).then(async habitacion => {
    let fechaInicio = habitacion.hospedaje.fechaInicio;
    let fechaFinal = new Date();
    let presupuesto = null;
    presupuesto = presupuestar(habitacion.tarifa, utilGlobal.checkIn, utilGlobal.checkOut, fechaInicio, fechaFinal);

    let hospedaje = new entityHospedaje.model({
      nombre: habitacion.nombre,
      tipo: habitacion.tipo,
      tarifa: habitacion.tarifa,
      capacidad: habitacion.capacidad,
      cliente: habitacion.cliente,
      hospedaje: {
        fechaInicio: fechaInicio,
        fechaFinal: fechaFinal,
        cronologia: presupuesto,
        pago: habitacion.hospedaje.pago
      }
    });

    habitacion.cliente = null;
    habitacion.hospedaje = null;
    habitacion.estado = "disponible";
    await hospedaje.save();
    await habitacion.save();
    return habitacion;
  });
}

module.exports = {
  presupuestar,
  rent,
  pay,
  free
};
