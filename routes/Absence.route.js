const express = require('express');
const router = express.Router();
const AbsenceController = require('../controllers/Absence.controller');

// Route pour obtenir toutes les absences
router.get('/absences', AbsenceController.getAllAbsences);

// Route pour obtenir une absence par ID
router.get('/absences/:id', AbsenceController.getAbsenceById);

// Route pour créer une absence pour un module spécifique
router.post('/modules/:moduleId/absences/create', AbsenceController.createAbsence);

// Autres routes pour les opérations de mise à jour et de suppression des absences...

module.exports = router;
