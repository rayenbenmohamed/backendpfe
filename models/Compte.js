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
      default: true,
    },
    role: {
      type: String,
      enum: ['candidat', 'formateur', 'admin'],
      
    },
    token: {
      type: String,
      default: null }
  });

  const Compte = mongoose.model('Compte', compteSchema);

  module.exports = Compte;
