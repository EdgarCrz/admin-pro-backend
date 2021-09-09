const { Schema, model } = require("mongoose"); // desestructuracion

const usuarioSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
  },
  google: {
    type: Boolean,
    default: false,
  },
});

usuarioSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject(); // De esta manera estoy extrayendo esas valores del objeto y solo retorno el ...object ya sin los valores extraidos
  object.uid = _id; // cambiamos _id por uid y retornamos el objeto ya con estas configuraciones
  // aqui indicamos que object va a tener una nueva propiedad que va a ser "uid" y que tendre el valor de lo extraido
  // por ultimo retornamos el object
  return object;
});
module.exports = model("Usuario", usuarioSchema);

// Todo esto en si es el modelo "Usuario" aqui mismo se hace el esquema
