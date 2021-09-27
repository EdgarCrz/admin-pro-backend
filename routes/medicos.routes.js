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
} = require("../controllers/medicos.controllers");

const router = Router();

router.get("/", getMedicos);
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
router.put("/:id", actualizarMedicos);
router.delete("/:id", borrarMedicos);

module.exports = router;
