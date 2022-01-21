const express = require("express"); // esto es como hacer una importacion en Angular, pero con lenguaje JS // importo express, para crear la aplicacion
require("dotenv").config(); //Esto busca el archivo .env,y con el podemos usar sus variables de entorno para poder usarlas en toda la aplicacion
const { dbConnection } = require("./database/config"); // la exportacion es un objeto, por eso debemos desestructurarlo para sacar exactamente lo que queremos ya que en las exportaciones pueden venir mas funciones ademas de la conexion
const app = express(); //Crea una aplicación Express. La función express () es una función de nivel superior exportada por el módulo express.
const cors = require("cors"); //implementamos el paquete de la configuracion de peticiones al servidor
const path = require('path');
const res = require("express/lib/response"); // para que las rutas funcionen bien con

//TODO:Middlewares
// Configuracion de CORS
app.use(cors());
app.get("/products/:id", function (req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});
// Lectura y parseo del body
app.use(express.json()); //para poder leer json
// Base de datos
dbConnection();

// Directorio Publico
app.use(express.static("public"));

//Rutas

app.use("/api/usuarios", require("./routes/usuarios.routes")); //cuando la aplicacion use ese path, vamos a requerir el archivo en el path indicado
app.use("/api/login", require("./routes/auth.routes"));
app.use("/api/hospitales", require("./routes/hospital.routes"));
app.use("/api/medicos", require("./routes/medicos.routes"));
app.use("/api/todo", require("./routes/busquedas.routes"));
app.use("/api/upload", require("./routes/uploads.routes"));


// Lo ultimo


// Cualquier peticion que no este incluida dentro de las rutas de arriba va a caer aqui
// voy a responder a mi index.html que es mi aplicacion Angular
app.get('*', (req, resp) => {
  resp.sendFile( path.resolve(__dirname, 'public/index.html')); // Basicamente indicamos que cualquier peticion que no sea una de las de arriba vamos a contestar con nuestro index.html
})


app.listen(process.env.PORT, () => {
  console.log("Servidor corriendo en puerto", +process.env.PORT);
});
