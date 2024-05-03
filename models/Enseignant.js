
const mongoose = require('mongoose');


const enseignantSchema = new mongoose.Schema({
  
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
 
  email: {
    type: String,
    required: true,
    unique: true,
  },
  cin:{
    type: String,
    required: true,
    unique: true,
  },
  certificat:{
    type:String,
    required: true,

  }
  
});

const Enseignant = mongoose.model('Enseignant', enseignantSchema);

module.exports = Enseignant;
