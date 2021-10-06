const { OAuth2Client } = require("google-auth-library"); // importamos nuestra libreria de autentificacion de google

const client = new OAuth2Client(process.env.GOOGLE_ID); // creamos cliente(osea nosotros) una nueva instancia de Oauth2Client y para ello le mandamos nuestro "GOOGLE_ID" que nos dieron cuando generamos al crear nuestras credenciales para poder hacer uso de esta api

//modificamos un poco esta funcion a como esta en la pagina solo cambiamos a funcion flecha, y async tambien
// Recibimos como parametro el token que nos mandan del controlador
const googleVerify = async (token) => {
  // creamos una constante "ticket" con la cual await/aguardaremos que el "client(osea nuestras credenciales)" hagan la verificacion de el token que nos estan mandando, obviamente al hacer esto con google, google nos provee la informacino basica del usuario que eligio acceder con google
  const ticket = await client.verifyIdToken({
    idToken: token, // para poder hacer la verificacion,como lo hicimos en el anteior auth JWT le mandamos el token y nuestro GOOGLE_ID
    audience: process.env.GOOGLE_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload(); //guardamos en payload lo que obtenemos de ticket en su metodo "traer payload()", recordemos que en el payload viene la informacion basica del usuario

  const { name, email, picture } = payload; // desestructuramos la informacion del usuario

  return { name, email, picture }; // la retornamos para poder usarla en el controlador
};

module.exports = { googleVerify };
