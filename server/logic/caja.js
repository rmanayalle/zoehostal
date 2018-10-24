const entityCaja = require('../entity/caja');

async function addCajaHabitacion(
  monto,
  habitacion,
  cliente
){
  return await entityCaja.model.findOne({"isClosed": false}).exec().then(async caja => {
    if(caja !== null){
      caja.historia.hospedaje.push({
        fecha: new Date(),
        monto: monto,
        habitacion: {
          nombre: habitacion.nombre,
          tipo: habitacion.tipo,
          tarifa: habitacion.tarifa
        },
        cliente: cliente
      });

      caja.historia.total += monto;

      await caja.save();
      return caja;
    }
    else return {
      isClosed: false,
      fecha: new Date(),
      inicial: 0,
      historia: {
        total: 0,
        hospedaje: [],
        otro: []
      }
    };

  });
}

async function addCajaOtro(
  monto,
  asunto
){
  return await entityCaja.model.findOne({"isClosed": false}).exec().then(async caja => {
    if(caja !== null){
      caja.historia.otro.push({
        fecha: new Date(),
        monto: monto,
        asunto: asunto
      });

      caja.historia.total += monto;

      await caja.save();
      return caja;
    }
    else return {
      isClosed: false,
      fecha: new Date(),
      inicial: 0,
      historia: {
        total: 0,
        hospedaje: [],
        otro: []
      }
    };

  });
}

async function getCaja(isClosed){
  return await entityCaja.model.find({"isClosed": isClosed}).exec();
}

async function nuevaCaja(monto){
  return await entityCaja.model.findOne({"isClosed": false}).exec().then(async caja => {
    if(caja !== null){
      caja.isClosed = true;
      await caja.save();
    }

    let _nuevaCaja = new entityCaja.model({
      isClosed: false,
      fecha: new Date(),
      inicial: monto,
      historia: {
        total: 0,
        hospedaje: [],
        otro: []
      }
    });
    await _nuevaCaja.save();
    return _nuevaCaja;
  });
}

module.exports = {
  addCajaHabitacion,
  addCajaOtro,
  getCaja,
  nuevaCaja
}
