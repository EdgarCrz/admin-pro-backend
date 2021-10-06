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

// Actualizar Medico
const actualizarMedicos = async (req, res = response) => {
  const id = req.params.id;
  const uid = req.uid;

  try {
    const medico = await Medico.findById(id);

    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el medico por ese id",
      });
    }

    const cambiosMedico = {
      ...req.body,
      usuario: uid,
    };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      cambiosMedico,
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

// Borrar Medicos
const borrarMedicos = async (req, res = response) => {
  const id = req.params.id;
  try {
    const medico = await Medico.findById(id);
    if (!medico) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el medico por ese id",
      });
    }

    await Medico.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Medico borrado",
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
  getMedicos,
  crearMedicos,
  actualizarMedicos,
  borrarMedicos,
};
