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
  role: {
    type: String,
    enum: ['candidat', 'formateur', 'admin'],
    default: 'candidat',
  },
});

const Compte = mongoose.model('Compte', compteSchema);

module.exports = Compte;
