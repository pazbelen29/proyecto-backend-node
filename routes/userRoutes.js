const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verificarToken = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Rutas de usuarios
router.get('/', userController.obtenerUsuarios);
router.post('/', verificarToken, userController.crearUsuario);
router.post('/transaccion', verificarToken, userController.crearUsuarioConPedido);
router.put('/:id', verificarToken, userController.actualizarUsuario);
router.delete('/:id', verificarToken, userController.eliminarUsuario);

// Endpoint POST /upload para subir imagen
router.post('/upload', verificarToken, upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'No se ha subido ningún archivo' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    status: 'success',
    message: 'Archivo subido correctamente',
    data: { ruta: fileUrl }
  });
});

module.exports = router;