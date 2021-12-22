const mongoose = require("mongoose");// libreria de node para escribir consultas  para una base de datos de mongoDB: VALIDACIONES CONSCTRUCCION DE QUERIS MIDDLEWARES

// Creamos la conexion de manera asincrona mas info en 96 del avanzado
const dbConnection = async () => {
  // try/trata, intenta hacer esto, si no se pudo te vas al catch
  try {
    await mongoose.connect(process.env.DB_CNN); // usamos una variable de entorno

    console.log("DB ONLINE");
  } catch (error) {
    // el catch atrapa el error que nos mande en consola y nos lo imprimira con el console.log
    console.log(error);
    throw new Error("Error al iniciar la base de datos");
  }
};

// Exportamos la conexion con la base de datos
module.exports = {
  dbConnection,
};
