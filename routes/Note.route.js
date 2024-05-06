const express = require('express');
const router = express.Router();
const NoteController = require('../controllers/Note.controller');

// Route pour ajouter des notes pour un module spécifique
router.post('/modules/:moduleId/notes', NoteController.addNotes);

module.exports = router;
