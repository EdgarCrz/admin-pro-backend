/* 
    Ruta:  /api/usuarios
*/
const { Router } = require("express"); // importamos esto para configurar las rutas
const { check } = require("express-validator"); //check es un middleware/ este paquete se encarga de hacer varios validaciones(middlewares)
const { validarCampos } = require("../middlewares/validar-campos");
const {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuarios.controllers"); // importamos el controlador que vamos a usar
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

// Ruta Trer
router.get("/", validarJWT, getUsuarios);

// Ruta Crear
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(), //el primer argumento es el campo a validar, el segundo es el mensaje en caso de que nos encontemos con un error con dicho campo un mensaje especifico para cada campo
    check("password", "El password es obligatorio").not().isEmpty(), //el primer argumento es el campo a validar, el segundo es el mensaje en caso de que nos encontemos con un error con dicho campo un mensaje especifico para cada campo
    check("email", "El correo es obligatorio").isEmail(), //el primer argumento es el campo a validar, el segundo es el mensaje en caso de que nos encontemos con un error con dicho campo un mensaje especifico para cada campo
    validarCampos, //al terminar de revisar los campos ahora si va la funcion que revisa los errores que trae el request
  ],
  crearUsuarios
);

// Ruta Actualizar
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El nombre es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

// Ruta Borrar
router.delete("/:id", validarJWT, borrarUsuario);

module.exports = router;

// Aquí solo estara el conjunto de rutas para el usuario, en otro archivo vamos a guardar nuestros controladores(la logica de las peticiones al backend)
