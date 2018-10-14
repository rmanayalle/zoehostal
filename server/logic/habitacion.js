const entityHabitacion = require('../entity/habitacion');
const logicOperaciones = require('./operaciones');
const utilGlobal = require('../util/global');

async function getHabitacion(args){
  return await entityHabitacion.model.find(args.habitacion).exec().then(async habitaciones => {
    await Promise.all(
      await habitaciones.map(async habitacion => {
          if(habitacion.fechaInicio !== undefined){
            let fechaInicio = habitacion.hospedaje.fechaInicio;
            let fechaFinal = habitacion.hospedaje.fechaFinal;
            let dateNow = new Date();
            if(dateNow > fechaFinal){
              let presupuesto = logicOperaciones.presupuestar(habitacion.tarifa, utilGlobal.checkIn, utilGlobal.checkOut, fechaInicio, dateNow);
              habitacion.hospedaje.cronologia = presupuesto;
              await habitacion.save();
            }
          }
      })
    );

    return habitaciones;
  });
}

module.exports = {
  getHabitacion
};
