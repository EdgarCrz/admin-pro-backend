const path = require("path"); //El pathmódulo proporciona utilidades para trabajar con rutas de archivos y directorios.
const fs = require("fs");

const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { actualizarImagen } = require("../helpers/actualizar-img");

const fileUpload = (req, res = response) => {
  const tipo = req.params.tipo;
  const id = req.params.id;
  // validar tipo

  const tiposValidos = ["usuarios", "hospitales", "medicos"];

  if (!tiposValidos.includes(tipo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es un medico, usuario u hospital",
    });
  }
  // validamos la exitencia de un archivo, esto viene en el paquete

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No hay ningun archivo",
    });
  }
  // procesar la imagen...
  // https://www.npmjs.com/package/express-fileupload  documentacion sobre el paquete file_upload

  const file = req.files.imagen; // podemos usar files, gracias al paquede te node files-upload
  const nombreCortado = file.name.split("."); //ej: [wolvering.1.3.jpg] se convierte en un arreglo y cada elemento es serparado por el "." entonces el length() = 4
  const extensionArchivo = nombreCortado[nombreCortado.length - 1]; // asi se saca el ultimo item de un array alv, esto es el length [1,2,3,4] pero la verdadera forma es esto [0,1,2,3] (El 3 es el que me interesa) entonces al "length" que es 4  le quito uno para optener el 3 del array
  //esto  seria: igual array "nombre cortado" en la posicion [0,1,2,3] = el largo es 4, -1 = 3 y 3 es la posicion que necesitamos o bueno en cada caso es dierente pero ya que los arreglos inician en 0 le tenemos que restar esa posicion

  // Validar extension

  const extensionesValidas = ["jpg", "png", "jpeg", "gif"]; // estas seran las unicas extenciones validas, podemos añadir mas dependiento lo que necesitemos

  if (!extensionesValidas.includes(extensionArchivo)) {
    return res.status(400).json({
      ok: false,
      msg: "No es una extension permitida",
    });
  }

  // Generar el nombre del archivo
  // const nombreArchivo = uuidv4();

  const nombreArchivo = `${uuidv4()}.${extensionArchivo}`; // usamos backticks para contatenar estos dos strings notese que añadimos un punto

  // path para guardar la imagen

  const path = `./uploads/${tipo}/${nombreArchivo}`; // construimos el path, ahi se cambia el nombre del archivo con el nuevo nombre con el que se guardara en la ruta

  // Mover la imagen
  //mv(): es para mover el archivo  en este caso "file" y como parametro recibe el path a donde lo queremos mandar, como callback tiene un error en caso de que algo salga mal

  file.mv(path, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        ok: false,
        msg: "Error al mover la imagen",
      });
    }

    //Actualizar la base de datos
    actualizarImagen(tipo, id, nombreArchivo);

    res.json({
      ok: true,
      msg: "Archivo Subido",
      nombreArchivo,
    });
  });
};
// Este modulo es para poder mostrar la imagen cuando hagan la petición
const retornaImagen = (req, res = response) => {
  const tipo = req.params.tipo; // recibimos ambos parametros de la URL
  const foto = req.params.foto; // recibimos ambos parametros de la URL

  const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`); // "__dirname": es la hubicacion donde se encuentra desplegada la app/ despues path  Une todos los argumentos(el __dirname y la ruta que se armo) y normaliza la ruta resultante. Los argumentos deben ser cadenas
  // como respuesta devolvemos la imagen y a sendFile le mandamos el path donde se encuentra para que la pueda regresar

  //  Si existe nuestra imagen la mostraremos si no mandamos la ruta de la imagen por default
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    // Imagen por defecto
    const pathImg = path.join(__dirname, `../uploads/no-image-box.jpg`);
    res.sendFile(pathImg);
  }
};

module.exports = {
  fileUpload,
  retornaImagen,
};
