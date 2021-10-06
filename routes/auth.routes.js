/* 
    Ruta:  /api/login
*/

const { Router } = require("express"); // importamos esto para configurar las rutas
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const {
  login,
  googleSignIn,
  renewToken,
} = require("../controllers/auth.controllers");
const { validarJWT } = require("../middlewares/validar-jwt");

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

router.post(
  "/google",
  [check("token", "El token es obligatorio").not().isEmpty(), validarCampos],
  googleSignIn
);

router.get("/renew", validarJWT, renewToken);

module.exports = router;
