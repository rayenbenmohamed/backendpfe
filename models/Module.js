const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  nomModule: {
    type: String,
    required: true,
    trim: true
  },
  etudiants: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Etudiant'
    }],
    default: []  
  },
  enseignant: {
    type: Schema.Types.ObjectId,
    ref: 'Enseignant'
  },
  formations: {
    type: Schema.Types.ObjectId,
    ref: 'Formation'
  },
 
  

});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;
