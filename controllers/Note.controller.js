const Note =require('../models/Note')


const NoteController = {
    addNotes: async (req, res) => {
      const { moduleId, notes } = req.body;
  
      try {
        const nouvellesNotes = [];
  
        for (const note of notes) {
          const nouvelleNote = await Note.create({
            etudiant: note.etudiantId,
            module: moduleId,
            note: note.note,
            commentaire: note.commentaire,
          });
  
          nouvellesNotes.push(nouvelleNote);
        }
  
        res.status(201).json(nouvellesNotes);
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },
  };
  module.exports = NoteController
  