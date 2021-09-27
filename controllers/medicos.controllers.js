const { response } = require("express");

const Medico = require("../models/medicos.model");

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img");
  res.json({
    ok: true,
    medicos,
  });
};
const crearMedicos = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({ usuario: uid, ...req.body }); // usamos spred {...} para generar una copia del body donde indicamos que el usuario va a ser el uid que obtuvimos arriba
  try {
    const medicoDB = await medico.save();
    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};
const actualizarMedicos = (req, res = response) => {
  res.json({
    ok: true,
    msg: "ActualizarMedicos",
  });
};
const borrarMedicos = (req, res = response) => {
  res.json({
    ok: true,
    msg: "BorrarMedicos",
  });
};

module.exports = {
  getMedicos,
  crearMedicos,
  actualizarMedicos,
  borrarMedicos,
};
