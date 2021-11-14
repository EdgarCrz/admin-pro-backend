const bcrypt = require("bcryptjs/dist/bcrypt");
const { response } = require("express");
const {
  findById,
  findByIdAndUpdate,
  findOne,
} = require("../models/usuario.model");
const Usuario = require("../models/usuario.model");
const { generarJWT } = require("../helpers/jwt");

// TODO: Controlador GET
const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0; //esto busca "desde en mi url el parametro "desde" y en ella el valor que contenga"
  // const usuarios = await Usuario.find({}, "nombre email role google")
  //   .skip(desde)
  //   .limit(5); //find:Crea una consulta de búsqueda: obtiene una lista de documentos que coinciden con el filtro. si no se le pone filtro nos trae toda la info de la coleccion, skio(): numero de documentos a omitir
  // const total = await Usuario.count();

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email role google img").skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);
  res.json({
    ok: true,
    usuarios,
    total,
    // uid: req.uid, lo curioso de esto, es que es a uid del usuario que hizo la peticion, Nota importante, ya que es un middleware, gracias a esto impediremos que cualquier persona haga una peticion a la base, salvo tenga un token que exista dentro de ella
  });
};
// TODO:Controlador POST
// ya que guardar puede demorar un tiempo usamos ASYNC y para esperar usamos AWAIT
const crearUsuarios = async (req, res = response) => {
  const { password, email, nombre } = req.body; //Desestructuramos lo que nos manda el usuario
  // guardamos
  try {
    const existeEmail = await Usuario.findOne({ email }); //crea una constante "existeEmail" y en el modelo Usuario "busca uno" filtramos por email(evitamos redundancia), y le pasamos el correo que nos estan mandando al hacer el GET
    //si "existeEnail" es true, quiere decir que coincidio con un correo en la base de datos
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya esta registrado",
      });
    }
    const usuario = new Usuario(req.body); //usamos nuestro esquema para hacer una instancia de el y le mandamos como argumento lo que el usuario nos mando
    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    // Guardar usuario
    await usuario.save();
    // Generar el token
    const token = await generarJWT(usuario.id);
    res.json({
      ok: true,
      usuario: usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }
    const { password, google, email, ...campos } = req.body; // de esta manera extraemos campos de un objeto, en este caso google solo es ejemplo de que en caso de que nos manden un parametro que no debe ser modificado, ponemos borrarlo afecte en nuantes de que afecte a nuestro modelo.
    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ /*email:*/ email }); // se puede evitar redundancia en javascrip cuando la propiedad se llama igual que el valor
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Ya existe un usuario con ese email",
        });
      }
    }

    // actualizaciones
    // Con esto evitamos la modificacion de email si esta fue una autenticacion de google, tambien validamos la posibilidad de que mostrar un error en caso de que intentasen cambiar el correo para que le mande un mensaje de error
    if (!usuarioDB.google) {
      campos.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario de google no pueden cambiar su correo",
      });
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });
    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const borrarUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);
    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario por ese id",
      });
    }

    await Usuario.findByIdAndDelete(uid);
    res.json({
      ok: true,
      msg: "Usuario eliminado",
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
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
};
