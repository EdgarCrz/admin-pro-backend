/* 
    Ruta:  /api/todo/
*/

const { Router } = require("express");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getTodo,
  getDocumentosColeccion,
} = require("../controllers/busquedas.controllers");

const router = Router();

router.get("/:busqueda", validarJWT, getTodo);
router.get("/coleccion/:tabla/:busqueda", validarJWT, getDocumentosColeccion); //coleccion es parte de la rut, y :tabla :busqueda son los parametros a buscar

module.exports = router;
