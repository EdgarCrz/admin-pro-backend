const jwt = require("jsonwebtoken");

const generarJWT = (uid) => {
  // aqui agregamos esta promesa, para meter dentro toda la generacion de el JWT, ya que demanera nativa el jwt trabaja con callbacks, y a nosotros nos interesa que sea una promesa para poder usar async, de esta manera podemos usar el reject en el callback de el error, y si todo sale ok el pasando el token resolve(token)
  return new Promise((resolve, reject) => {
    //   payload: Va a ser la informacion que determinara la validacion de mi usuario, o los privilegios de los que goza
    const payload = {
      uid,
    };
    //sing: crea el Jwt con los valores que le pasamos, el payload y la firma "secreta" ademas de que le pasamos una propiedad que es el tiempo en el que expirara esta autencacion de usuario
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
      //   como cuarta propiedad será un callback que nos devolvera ya sea un error o el token creado, esto es una funcion sincrona por lo cual se ejecuta al instante, por otro lado nosotros ocupamos que esto sea una funcion asyncrona puesto que la creacion de el JWT tome unos segundos necesitamos manejar esto con una promesa  para poder usar async y await
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar el JWR");
        } else {
          resolve(token); // ya que encerramos toda la generacion del JWT en una promesa, podemos hacer uso del resolve asi como del reject
        }
      }
    );
  });
};

module.exports = {
  generarJWT,
};
