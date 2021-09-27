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

const actualizarHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "Actualizar ",
  });
};

const borrarHospital = (req, res = response) => {
  res.json({
    ok: true,
    msg: "Borrar ",
  });
};

module.exports = {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
};
