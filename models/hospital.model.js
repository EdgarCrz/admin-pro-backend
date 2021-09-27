const { Schema, model } = require("mongoose"); // desestructuracion

const HospitalSchema = Schema(
  {
    nombre: {
      type: String,
      required: true,
    },

    img: {
      type: String,
    },
    usuario: {
      required: true,
      type: Schema.Types.ObjectId, // Este usuario es de un tipo especial ya que le vamos a indicar que este usuario, va a ser el mismo de otra "tabla" y mediante el id, de el modelo Usuario
      ref: "Usuario",
    },
  },
  { collection: "hospitales" }
);

HospitalSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject(); // De esta manera estoy extrayendo esas valores del objeto y solo retorno el ...object ya sin los valores extraidos
  // por ultimo retornamos el object
  return object;
});
module.exports = model("Hospital", HospitalSchema);

// Todo esto en si es el modelo "Usuario" aqui mismo se hace el esquema
