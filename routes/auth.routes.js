/* 
    Ruta:  /api/login
*/

const { Router } = require("express"); // importamos esto para configurar las rutas
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const { login } = require("../controllers/auth.controllers");

const router = Router();

router.post(
  "/",
  [
    check(
      "email",
      "El email es requerido o verifique que sea un email valido"
    ).isEmail(),
    check("password", "Ingrese la contraseña").not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;