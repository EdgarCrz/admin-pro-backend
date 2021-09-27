const Usuario = require("../models/usuario.model");
const Medico = require("../models/medicos.model");
const Hospital = require("../models/hospital.model");
const fs = require("fs");

// esta funcion es para replicar
const borrarImagen = (path) => {
  if (fs.existsSync(path)) {
    //   borrar la img anterior
    fs.unlinkSync(path); // en caso de encontrar el path si es que existe, lo procedemos a borrar
  }
};
const actualizarImagen = async (tipo, id, nombreArchivo) => {
  // Generamos un switch
  let pathViejo = "";

  switch (tipo) {
    case "usuarios":
      const usuario = await Usuario.findById(id); // validacion: verificamos que el usuario exista dentro de nuestra base
      if (!usuario) {
        console.log("no se encontro un usuario por id");
        return false;
      }

      pathViejo = `./uploads/usuarios/${usuario.img}`;
      //   file sistem nos permite interactuar con el sistema de archivos de una manera "modelada"
      //   existsSync : busca el path que le mandamos
      borrarImagen(pathViejo);

      usuario.img = nombreArchivo;
      await usuario.save();
      return true;
      break;
    case "medicos":
      const medico = await Medico.findById(id); // validacion: verificamos que el usuario exista dentro de nuestra base
      if (!medico) {
        console.log("no se encontro un medico por id");
        return false;
      }

      pathViejo = `./uploads/medicos/${medico.img}`;
      //   file sistem nos permite interactuar con el sistema de archivos de una manera "modelada"
      //   existsSync : busca el path que le mandamos
      borrarImagen(pathViejo);

      medico.img = nombreArchivo;
      await medico.save();
      return true;
      break;
    case "hospitales":
      const hospital = await Hospital.findById(id); // validacion: verificamos que el usuario exista dentro de nuestra base
      if (!hospital) {
        console.log("no se encontro un hospital por id");
        return false;
      }

      pathViejo = `./uploads/hospitales/${hospital.img}`;
      //   file sistem nos permite interactuar con el sistema de archivos de una manera "modelada"
      //   existsSync : busca el path que le mandamos
      borrarImagen(pathViejo);

      hospital.img = nombreArchivo;
      await hospital.save();
      return true;

      break;
  }
};

module.exports = { actualizarImagen };
