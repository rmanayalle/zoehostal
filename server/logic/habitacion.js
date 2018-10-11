var _habitacion = require('../model/habitacion');
let modelHabitacion = require('../model/habitacion');
let logicOperaciones = require('./operaciones');

async function getHabitacion(args){
  return await modelHabitacion.model.find(args.habitacion).exec().then(async habitaciones => {

    await Promise.all(await habitaciones.map(async habitacion => {
      let fechaInicio = habitacion.fechaInicio;
      let fechaFinal = habitacion.fechaFinal;
      let dateNow = new Date();
      if(dateNow > fechaFinal){
        let presupuesto = await logicOperaciones.presupuestar(habitacion, new Date(2018,12,12,14,0,0), new Date(2018,12,12,12,0,0), fechaInicio, dateNow);
        habitacion.registro.detalle = presupuesto.detalle;
        await habitacion.save();
      }
    }));

    return habitaciones;
  });
}

module.exports = {
  getHabitacion
};
