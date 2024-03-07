const express = require('express');
const router = express.Router();
const FormationController = require('../controllers/Formations.controller');

router.get('/formations', FormationController.getAllFormations);
router.get('/formations/:id', FormationController.getFormationById);
router.post('/formations', FormationController.createFormation);
router.put('/formations/:id', FormationController.updateFormation);
router.delete('/formations/:id', FormationController.deleteFormation);

module.exports = router;
