
const mongoose = require('mongoose');


const enseignantSchema = new mongoose.Schema({
  enseignantId: {
    type: Number,
    required: true,
    unique: true,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  matiere: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const Enseignant = mongoose.model('Enseignant', enseignantSchema);

module.exports = Enseignant;
