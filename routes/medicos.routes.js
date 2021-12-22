/* 
    Medicos
    ruta: "api/medicos"
 */

const { Router } = require("express");
const { check } = require("express-validator"); //check es un middleware/ este paquete se encarga de hacer varios validaciones(middlewares)
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getMedicos,
  crearMedicos,
  actualizarMedicos,
  borrarMedicos,
  getMedicoById,
} = require("../controllers/medicos.controllers");

const router = Router();
// Trer medicos
router.get("/", validarJWT, getMedicos);
// Crear medicos
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del medico es requerido").not().isEmpty(),
    check("hospital", "El hospital id debe ser valido").isMongoId(),
    validarCampos,
  ],
  crearMedicos
);
// para actualizar medicos
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre del medico es requerido").not().isEmpty(),
    check("hospital", "El hospital id debe ser valido").isMongoId(),
    validarCampos,
  ],
  actualizarMedicos
);
// Borrar medicos
router.delete("/:id", validarJWT, borrarMedicos);

// Traer un medico de manera individual, lo necesario para estro va a ser el :id en este caso va a ser el paremtro que venga al final de la url
router.get("/:id", validarJWT, getMedicoById); // tambien necesitamos pasarle el jwt y despues de verificar que tenga eso podemos pasar a nuestro controlador

module.exports = router;
