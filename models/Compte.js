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
    default: null
  },
  image: { // Added image field
    type: String,
    default: null // This will store the URL provided by Cloudinary
  },
  notifications: [{ // Champ ajouté pour stocker les notifications
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    lu: { type: Boolean, default: false }
  }],
});

const Compte = mongoose.model('Compte', compteSchema);

module.exports = Compte;
