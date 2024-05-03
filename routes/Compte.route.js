const router = require('express').Router();
const CompteController = require('../controllers/Compte.controller');  // Ensure correct path
const { multerUpload, upload } = require('../Middleware/upload');  // Ensure correct path

router.put('/compte/:id/image', multerUpload.single('image'), upload, CompteController.addImageToCompte);

module.exports = router;