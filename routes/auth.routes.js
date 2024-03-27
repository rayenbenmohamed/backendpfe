const express = require('express');
const { register, login, changePassword } = require('../controllers/Authentification.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password/:id', changePassword); // S'assurer que l'ID est inclus dans l'URL

module.exports = router;
