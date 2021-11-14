const { response } = require("express");
const jwt = require("jsonwebtoken");

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

module.exports = {
  validarJWT,
};
