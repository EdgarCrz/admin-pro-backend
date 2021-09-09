const { response } = require("express");
const { validationResult } = require("express-validator"); //este es para atrapar los errores que pudiesen surgir por los middleware que se implementaron

const validarCampos = (req, res = response, next) => {
  const errores = validationResult(req); // al pasar por los "checks" de las rutas, crea en el request un arreglo de errores, es por eso que aqui le pasamos como parametro la "req" para que pueda revisar esos errores
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errores.mapped(), // con el mapped() nos envia un objeto de toda la info del error
    });
  }

  next();
};

module.exports = {
  validarCampos,
};
