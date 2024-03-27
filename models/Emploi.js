const mongoose = require('mongoose');

const plageHoraireSchema = new mongoose.Schema({
  heureDebut: String,
  heureFin: String,
  description: String // Add description to each time slot
});

const emploiSchema = new mongoose.Schema({
  nomEmploi: { // Add a name to the schedule
    type: String,
    required: true
  },
  lundi: [plageHoraireSchema],
  mardi: [plageHoraireSchema],
  mercredi: [plageHoraireSchema],
  jeudi: [plageHoraireSchema],
  vendredi: [plageHoraireSchema],
  samedi: [plageHoraireSchema],
  dimanche: [plageHoraireSchema]
});

const Emploi = mongoose.model('Emploi', emploiSchema);

module.exports = Emploi;
