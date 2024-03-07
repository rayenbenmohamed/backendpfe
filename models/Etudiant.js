const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
  etudiantId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
    default: 1,
  },
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  date_naissance: {
    type: Date,
    required: true
  },
  numTel: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  cin: {
    type: String, 
    unique: true,
  },
  niveauScolaire: {
    type: String, 
  },
});


const Etudiant = mongoose.model('Etudiant', etudiantSchema);

module.exports = Etudiant;
