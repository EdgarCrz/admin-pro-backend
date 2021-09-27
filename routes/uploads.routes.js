/*


ruta: api/upload
 */

const { Router } = require("express");
const expressFileUpload = require("express-fileupload");

const { validarJWT } = require("../middlewares/validar-jwt");
const {
  fileUpload,
  retornaImagen,
} = require("../controllers/uploads.controllers");

const router = Router();
// usamos este middleware que es para el manejo de archivos
router.use(expressFileUpload());

// router.put("/:tipo/:id", validarJWT, fileUpload);
router.put("/:tipo/:id", validarJWT, fileUpload);
//ruta para traer imagenes
router.get("/:tipo/:foto", retornaImagen);

module.exports = router;
