const express = require("express"); // esto es como hacer una importacion en Angular, pero con lenguaje JS // importo express, para crear la aplicacion
require("dotenv").config(); //Esto busca el archivo .env,y con el podemos usar sus variables de entorno para poder usarlas en toda la aplicacion
const { dbConnection } = require("./database/config"); // la exportacion es un objeto, por eso debemos desestructurarlo para sacar exactamente lo que queremos ya que en las exportaciones pueden venir mas funciones ademas de la conexion
const app = express(); //Crea una aplicación Express. La función express () es una función de nivel superior exportada por el módulo express.
const cors = require("cors"); //implementamos el paquete de la configuracion de peticiones al servidor

//TODO:Middlewares
// Configuracion de CORS
app.use(cors());
// Lectura y parseo del body
app.use(express.json()); //para poder leer json
// Base de datos
dbConnection();

//Rutas

app.use("/api/usuarios", require("./routes/usuarios.routes")); //cuando la aplicacion use ese path, vamos a requerir el archivo en el path indicado
app.use("/api/login", require("./routes/auth.routes"));

app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto", +process.env.PORT);
});
