
const express = require('express');
const router = express.Router();
const EmploiController = require('../controllers/Emploi.controller');

// Assure-toi que tu as une fonction de rappel définie pour la méthode POST
router.post('/emploi', EmploiController.createEmploi);
router.get('/emploi/:id', EmploiController.getEmploiByCoursId);
router.get('/emplois', EmploiController.getAllEmplois);
router.put('/emploi/:id', EmploiController.updateEmploi);
router.delete('/emploi/:id', EmploiController.deleteEmploi);

module.exports = router;
