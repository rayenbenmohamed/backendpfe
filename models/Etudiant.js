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
  age: {
    type: Number,
  },
  numTel: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
 

});

const Etudiant = mongoose.model('Etudiant', etudiantSchema);

module.exports = Etudiant;
