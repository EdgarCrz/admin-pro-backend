const { response } = require("express");
const Usuario = require("../models/usuario.model");
const Medico = require("../models/medicos.model");
const Hospital = require("../models/hospital.model");

const getTodo = async (req, res = response) => {
  //   const parametro = req.query.parametro;   Notese la diferencia entre este y el de abajo, aqui en cambio "?" podemos recibir o no un parametro y en la url le ponemos el nombre seguido del valor
  const busqueda = req.params.busqueda; // en las rutas definimos "/:busqueda" como la ruta indicando que el parametro que nos manden en la url sera "busqueda"
  const regex = new RegExp(busqueda, "i");
  // const usuarios = await Usuario.find({ nombre: regex });  para evitar que esto se hiciera uno despues de otro se uso promise.all//lo que ponga despues sera los parametros que quiero
  // const medicos = await Medico.find({ nombre: regex }); para evitar que esto se hiciera uno despues de otro se uso promise.all
  // const hospitales = await Hospital.find({ nombre: regex }); para evitar que esto se hiciera uno despues de otro se uso promise.all

  const [usuarios, medicos, hospitales] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Medico.find({ nombre: regex }),
    Hospital.find({ nombre: regex }),
  ]);
  try {
    res.json({
      ok: true,
      usuarios,
      medicos,
      hospitales,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const getDocumentosColeccion = async (req, res = response) => {
  const tabla = req.params.tabla;
  const busqueda = req.params.busqueda;
  const regex = new RegExp(busqueda, "i");
  let data = []; // en este caso usamos let porque precisamente esta puede cambiar al contrario de const

  switch (tabla) {
    case "medicos":
      data = await Medico.find({ nombre: regex })
        .populate("usuario", "nombre img") //Basicamente es urgar mediante la llave forane
        .populate("hospital", "nombre img"); //Basicamente es urgar mediante la llave forane
      break;

    case "hospitales":
      data = await Hospital.find({ nombre: regex }) //
        .populate("usuario", "nombre img");

      break;

    case "usuarios":
      data = await Usuario.find({ nombre: regex });

      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "La tabla tiene que ser hospitales/medicos/usuarios",
      });
  }

  res.json({
    ok: true,
    resultados: data,
  });
};

module.exports = {
  getTodo,
  getDocumentosColeccion,
};
