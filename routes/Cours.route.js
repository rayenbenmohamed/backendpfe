const express = require('express');
const router = express.Router();
const CoursController = require('../controllers/Cours.controller');

// Routes pour les cours
router.get('/cours', CoursController.getAllCours);
router.get('/cours/:id', CoursController.getCoursById);
router.post('/cours', CoursController.createCours);
router.put('/cours/:id', CoursController.updateCours);
router.delete('/cours/:id', CoursController.deleteCours);

router.post('/cours/:id/inscrire', CoursController.inscrireEtudiant);
router.get('/cours/:id/etudiants', CoursController.getEtudiantsInscrits);

module.exports = router;
