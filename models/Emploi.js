
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emploiSchema = new Schema({
  emploiId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  horaire: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  cours: {
    type: Schema.Types.ObjectId,
    ref: 'Cours',
    required: true,
  },
});

const Emploi = mongoose.model('Emploi', emploiSchema);

module.exports = Emploi;
