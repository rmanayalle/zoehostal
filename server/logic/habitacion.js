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

async function getHabitacionOcupado(){
  return await modelHabitacion.model.find({"estado": "ocupado"}).then(habitaciones => {
    let _habitaciones = [];
    habitaciones.map(habitacion => {

      let totalConsumido = 0;
      let totalPago = 0;
      let dateNow = new Date();
      habitacion.registro.detalle.map(itemDetalle => {
        if((dateNow>=itemDetalle.fechaInicio && dateNow>= itemDetalle.fechaFinal) || (dateNow<=itemDetalle.fechaFinal && dateNow>= itemDetalle.fechaInicio))totalConsumido+=itemDetalle.precio;
      });

      habitacion.registro.pago.map(itemPago => {
        totalPago+=itemPago.monto;
      });

      let totalDeuda = totalConsumido - totalPago;

      _habitaciones.push({
        nombre: habitacion.nombre,
        tipo: habitacion.tipo,
        deuda: (totalDeuda>=0)?totalDeuda:0
      });

    });
    return _habitaciones;
  });
}

module.exports = {
  getHabitacion,
  getHabitacionOcupado
};
