const { response } = require("express");

const Hospital = require("../models/hospital.model");

const getHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find().populate("usuario", "nombre img"); // populate: es como hacer un join en sql, usamos la llave foranea, y accedemos a valores de otra tabla, en este caso otro modelo
  res.json({
    ok: true,
    hospitales,
  });
};
const crearHospital = async (req, res = response) => {
  const uid = req.uid; // gracias a que pasamos por nuestra validacion del token, siempre tendremos el uid en la req,
  const hospital = new Hospital({ usuario: uid, ...req.body }); // "..." para extraer todo lo que se encuentre en el body y definimos que el valor de usuario va a ser el uid que obtubimos arriba

  try {
    const hospitalDB = await hospital.save();
    res.json({
      ok: true,
      hospital: hospitalDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// Actualizar hospital

const actualizarHospital = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid; // este lo obtenemos al pasarlo por el "validarJWT"

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el hospital por es id",
      });
    }
    // De la siguiente manera es por si llegamos a actualizar mas campos y que no se vea raro,
    const cambiosHospital = {
      ...req.body, // extraermos todo lo de la req.body,
      usuario: uid, // declaramos que la "propiedad del modelo usuario"  ahora va a tener este id, que es el que nos da la validacion del token, para ver quien hizo el cambio
    };
    // para actualizar usamos "findByIdAndUpdate" con el buscamos con el id que ya verificamos, y despues los parametros que van a ser modificados, y por ultimo una opcion para que al consultar me devuelva los valores nuevos
    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      cambiosHospital,
      { new: true }
    );
    res.json({
      ok: true,
      hospital: hospitalActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// Borrar Hospital

const borrarHospital = async (req, res = response) => {
  const id = req.params.id;

  try {
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el hospital por es id",
      });
    }
    await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Hospital borrado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
