const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const absenceSchema = new Schema({
  nomModule: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  etudiantsAbsents: [{
    type: Schema.Types.ObjectId,
    ref: 'Etudiant'
  }]
});

const Absence = mongoose.model('Absence', absenceSchema);

module.exports = Absence;
