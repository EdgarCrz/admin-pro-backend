const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

const validarJWT = (req, res = response, next) => {
  // Leer el token

  const token = req.header("x-token");

  if (!token) {
    res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET); //"desestructuramos uid"(desempaquetamos del json), jwt tiene una funcion para verificar nuestros jwt, basicamente lo que hace es "desencriptarlos" para poder acceder a sus valores, y para eso le tenemos que pasar el JWT y ademas la firma secreta que creamos, lo cual nos devuelve un json, y por tal usamos desestruturacion
    req.uid = uid; //antes de pasar a la siguiente funcion, determinamos que al req, le vamos a añadir un valor uid, que va a ser el uid que conseguimos del jwt
    // se asigna en la req, porque ahi vienen las cosas que el usuario nos manda, este caso recuperaremos el id, para poder mandarlo, asi como si el usuario nos lo proporcionara, pero los login no requieren que ingreses el id, solo correo y contraseña, y asi nosotros recuperamos el id para usarlo
    next(); // si no se emplea el next() nunca continuara la siguiente funcion, los middlewares son como controladores solo que ellos no tienen el next()
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
};

// Creamos esta funcion para hacer una validacion de el role, como estos dos metodos tienen similitudes, y ambos son de autentificacion no hay problema de meterlos dentro de el mismo archivo
// TODO: ESTO ES UN MIDDLEWARE bueno ambos lo son, son codigos que se ejecutan para realizar validaciones
// El next sirve para diferenciar entre un middleware y un contralador normal, ambas son similares
const validarADMIN_ROLE = async (req, res = response, next) => {
  // el uid se encuentra en la req porque se establecio en el validarJWT y como en ese punto ya estamos validados tendremos esa informacion
  const uid = req.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no exite",
      });
    }

    if (usuarioDB.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "No tienes los privilegios para realizar esta acción",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const validarADMIN_ROLE_o_MismoUsuario = async (req, res = response, next) => {
  // el uid se encuentra en la req porque se establecio en el validarJWT y como en ese punto ya estamos validados tendremos esa informacion
  const uid = req.uid;
  const id = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no exite",
      });
    }
// Si el usuario es un ADMIN O si el id de los params es igual al  uid de el usuario dentro de la base entonces quiere decir que este usuario si puede generar este cambio
    if (usuarioDB.uid === "ADMIN_ROLE" || id === uid) {
      next();
    } else {
      return res.status(403).json({
        ok: false,
        msg: "No tienes los privilegios para realizar esta acción",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
};
