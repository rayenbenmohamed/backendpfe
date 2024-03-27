// models/Presence.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const presenceSchema = new Schema({
  module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  date: { type: Date, required: true },
  etudiantsAbsents: [{ type: Schema.Types.ObjectId, ref: 'Etudiant' }]
}, {
  timestamps: true
});

const Presence = mongoose.model('Presence', presenceSchema);

module.exports = Presence;
