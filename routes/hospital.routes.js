/* 
    Hospitales 
    ruta: "api/hospitales"
 */

const { Router } = require("express");
const { check } = require("express-validator"); //check es un middleware/ este paquete se encarga de hacer varios validaciones(middlewares)
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
} = require("../controllers/hospitales.controllers");

const router = Router();

// Ruta Traer
router.get("/", validarJWT, getHospitales);

// Ruta Crear
router.post(
  "/",
  [
    validarJWT, //validamos que nos manden un token valido, para saber quien esta creando este hospital, asi como para poder recuperar el id de quien lo crea para relacionar las tablas Usuarios y Hospitales
    check("nombre", "El nombre del hospital es necesario").not().isEmpty(),
    validarCampos,
  ],
  crearHospital
);

// Ruta Actualizar
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del hospital es necesario").not().isEmpty(),
    validarCampos,
  ],
  actualizarHospital
);
// Ruta Borrar
router.delete("/:id", validarJWT, borrarHospital);

module.exports = router;

// Aquí solo estara el conjunto de rutas para el usuario, en otro archivo vamos a guardar nuestros controladores(la logica de las peticiones al backend)
