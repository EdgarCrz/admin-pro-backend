const bcrypt = require("bcryptjs");
const { response } = require("express");
const Usuario = require("../models/usuario.model");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-ferify");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificacion de Email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontro el correo",
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    // En caso de coincidir validPassword = true
    // En caso de NO coincidir validPassword = FALSE

    //para ejecutar esto se necesita un true, por ende si no machan necitamos negar el false para convertirlo en true y mostrar el error
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }
    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB.id);
    res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuarioDB.role) //en cada login el usuario va a obtener las rutas a las cuales tiene acceso
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    // "googleVerify" es un helper
    const { name, email, picture } = await googleVerify(googleToken); // de la funcion desestructuramos lo que nos mandamos en el return y ahora ya podemos hacer uso de esta informacion

    // Verificar si ya existe un usuario con el email en la base
    const usuarioDB = await Usuario.findOne({ email }); // buscamos uno que  coincida con email / la diferencia entre este usuarioDB y el de abajo es que este es uno ya existente
    let usuario; // este va a ser para la nueva instancia del modelo / la diferencia entre este usuario y el de arriba es que este será una nueva instancia, y el de arriba ya es uno existente, si se encuentra

    if (!usuarioDB) {
      // creamos la nueva instancia
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@", // no hay que preocuparse esta contraseña no va a funcionar, ya que al pasar por el hash no va a coincidir
        img: picture,
        google: true,
      });
    } else {
      //Existe usuario

      usuario = usuarioDB; //ahora indicamos que el usuario es igual al usuario que ya estaba en la base solo que ahora se autentifico con google
      usuario.google = true; // en este caso como a hora la autenficacion la hizo con google cambiamos a true, indicando asi que este usuario tambien se puede autenficar con google
    }
    //guardar en la base de datos
    await usuario.save(); // recuerda que cualquier peticion siempre va a ser  async

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuario.id); // si el usuario ya existia, quiere decir que ya tiene un id, entonces lo usamos para generat el jwt. en caso de que sea la primera vez que entra, en el paso anterior,al guardarlo en automatico tambien se le genera un token

    res.json({
      ok: true,
      msg: "Google SignIn",
      token,
      menu: getMenuFrontEnd(usuario.role) //en cada login el usuario va a obtener las rutas a las cuales tiene acceso
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      msg: "El token es incorrecto",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;// esto lo tenemos porque ya pasamos por el validarToken

  // Generar nuevo TOKEN - JWT
  const token = await generarJWT(uid); // si el usuario ya existia, quiere decir que ya tiene un id, entonces lo usamos para generat el jwt. en caso de que sea la primera vez que entra, en el paso anterior,al guardarlo en automatico tambien se le genera un token

  // Obtener el usuario

  const usuario = await Usuario.findById(uid); // esto con el fin de mandar como respuesta la informacion del usuario

  res.json({
    ok: true,
    token,
    usuario,
    menu: getMenuFrontEnd(usuario.role) //en cada login el usuario va a obtener las rutas a las cuales tiene acceso
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
