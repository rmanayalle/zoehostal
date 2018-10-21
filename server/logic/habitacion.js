const entityHabitacion = require('../entity/habitacion');
const logicOperaciones = require('./operaciones');
const utilGlobal = require('../util/global');

async function getHabitacion(args){
  return await entityHabitacion.model.find(args.habitacion).exec().then(async habitaciones => {
    await Promise.all(
      await habitaciones.map(async habitacion => {
          if(habitacion.hospedaje.fechaInicio !== undefined){
            let fechaInicio = habitacion.hospedaje.fechaInicio;
            let fechaFinal = habitacion.hospedaje.fechaFinal;
            let dateNow = new Date();
            let presupuesto = null;
            if(dateNow > fechaFinal) {
              presupuesto = logicOperaciones.presupuestar(habitacion.tarifa, utilGlobal.checkIn, utilGlobal.checkOut, fechaInicio, dateNow);
              habitacion.hospedaje.fechaFinal = dateNow;
            }
            else presupuesto = logicOperaciones.presupuestar(habitacion.tarifa, utilGlobal.checkIn, utilGlobal.checkOut, fechaInicio, fechaFinal);
            habitacion.hospedaje.cronologia = presupuesto;
            await habitacion.save();
          }
      })
    );

    return habitaciones;
  });
}

async function setFechaFinal(habitacionNombre, fechaFinal){
  return await entityHabitacion.model.findOne({"nombre": habitacionNombre}).exec().then(async habitacion => {
    if(habitacion.hospedaje.fechaInicio < habitacion.hospedaje.fechaFinal){
      habitacion.hospedaje.fechaFinal = fechaFinal;
      let presupuesto = logicOperaciones.presupuestar(habitacion.tarifa, utilGlobal.checkIn, utilGlobal.checkOut, habitacion.hospedaje.fechaInicio, fechaFinal);
      habitacion.hospedaje.cronologia = presupuesto;
      await habitacion.save();
    }
    return habitacion;
  });
}

module.exports = {
  getHabitacion,
  setFechaFinal
};
