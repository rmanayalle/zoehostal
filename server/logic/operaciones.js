const utilDate = require('../util/date.js');
let modelHabitacion = require('../model/habitacion');
let logicReniec = require('./reniec');

async function presupuestar(habitacion, checkIn, checkOut, fechaInicio, fechaFinal){
    let result = await modelHabitacion.model.findOne({"nombre": habitacion.nombre}).exec().then((iHabitacion) => {

      let res = {
        total: 0,
        detalle: []
      };

      if(utilDate.isSameDay(fechaInicio,fechaFinal) === true)fechaFinal = utilDate.withCheckOutFormat(utilDate.plusOneDay(fechaInicio),checkOut);

      let tarifaPerHour = Math.ceil(iHabitacion.tarifa/24);

      let diffHoursToCheckIn = checkIn.getHours() - fechaInicio.getHours();
      if(diffHoursToCheckIn <= 0)diffHoursToCheckIn = 0;
      else{
        if(fechaInicio.getMinutes() > 15)diffHoursToCheckIn--;
        res.detalle.push({
          fechaInicio: fechaInicio,
          fechaFinal: utilDate.withCheckInFormat(fechaInicio, checkIn),
          precio: diffHoursToCheckIn*tarifaPerHour
        });
        fechaInicio = utilDate.withCheckInFormat(fechaInicio, checkIn);
        res.total += diffHoursToCheckIn*tarifaPerHour;
      }

      for(; fechaInicio < utilDate.withCheckOutFormat(fechaFinal, checkOut); fechaInicio = utilDate.withCheckInFormat(utilDate.plusOneDay(fechaInicio), checkIn)){
        res.detalle.push({
          fechaInicio: fechaInicio,
          fechaFinal: utilDate.withCheckOutFormat(utilDate.plusOneDay(fechaInicio), checkOut),
          precio: iHabitacion.tarifa
        });
        res.total += iHabitacion.tarifa;
      }

      let diffHoursFromCheckOut = fechaFinal.getHours() - checkOut.getHours();
      if(diffHoursFromCheckOut <= 0)diffHoursFromCheckOut = 0;
      else{
        if(fechaFinal.getMinutes() > 15)diffHoursFromCheckOut++;
        res.detalle.push({
          fechaInicio: utilDate.withCheckOutFormat(fechaInicio, checkOut),
          fechaFinal: fechaFinal,
          precio: diffHoursFromCheckOut*tarifaPerHour
        });
        res.total += diffHoursFromCheckOut*tarifaPerHour;
      }
      return res;
    }).catch((err) => {
      return {
        total: 0,
        detalle: []
      };
    });
    return result;
}

async function alquilar(habitacion, cliente, checkIn, checkOut, fechaFinal){
  return await modelHabitacion.model.findOne({"nombre": habitacion.nombre}).exec().then(async (iHabitacion) => {
    let fechaInicio = new Date();
    return await presupuestar(iHabitacion, checkIn, checkOut, fechaInicio, fechaFinal).then(async (presupuesto) => {

      let clienteFromReniec = logicReniec.getClienteFromReniec(cliente.documentoNacional);

      iHabitacion.estado = "ocupado";
      iHabitacion.cliente = clienteFromReniec;
      iHabitacion.fechaInicio = fechaInicio;
      iHabitacion.fechaFinal = fechaFinal;
      iHabitacion.registro = {
        detalle: [],
        pago: []
      };
      presupuesto.detalle.map(item => {
        iHabitacion.registro.detalle.push({
          fechaInicio: item.fechaInicio,
          fechaFinal: item.fechaFinal,
          precio: item.precio
        });
      });
      await iHabitacion.save();
      return iHabitacion;
    });

  });
}

async function pagar(habitacion, monto){
  return await modelHabitacion.model.findOne({"nombre": habitacion.nombre}).then(async habitacion => {
    habitacion.registro.pago.push({
      fecha: new Date(),
      monto: monto
    });
    await habitacion.save();
    return habitacion;
  });
}

module.exports = {
  alquilar,
  presupuestar,
  pagar
};
