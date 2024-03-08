const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const compteSchema = new Schema({
  nomUtilisateur: {
    type: String,
    required: true,
    unique: true,
  },
  motDePasse: {
    type: String,
    required: true,
  },
  estActive: {
    type: Boolean,
    default: false,
  },
});

const Compte = mongoose.model('Compte', compteSchema);

module.exports = Compte;
