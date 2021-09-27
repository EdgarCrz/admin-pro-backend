const { Schema, model } = require("mongoose");

const MedicoSchema = Schema({
  nombre: {
    type: String,
    required: true,
  },

  img: {
    type: String,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  hospital: {
    type: Schema.Types.ObjectId, // asi indicamos "una llave foranea "este es el id del otro objeto" que objeto? de del hospital, de el modelo Hospital
    ref: "Hospital",
    required: true,
  },
});

// Esto basicamente es al "MedicoSchema" añadele un method llamado "toJson" esta funcion extrae "__v" del objeto y  eso va a ser el methodo por ultimo retorname el objeto ya sin la parte extraida
MedicoSchema.method("toJSON", function () {
  const { __v, ...object } = this.toObject();
  return object;
});

module.exports = model("Medicos", MedicoSchema);
