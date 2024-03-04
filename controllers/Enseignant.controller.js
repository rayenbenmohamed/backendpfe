// Enseignant.controller.js

const Enseignant = require('../models/Enseignant');

const EnseignantController = {
  getAllEnseignants: async (req, res) => {
    try {
      const enseignants = await Enseignant.find();
      res.status(200).json(enseignants);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getEnseignantById: async (req, res) => {
    const id = req.params.id;

    try {
      const enseignant = await Enseignant.findById(id);

      if (enseignant) {
        res.status(200).json(enseignant);
      } else {
        res.status(404).send('Enseignant non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  createEnseignant: async (req, res) => {
    const { nom, prenom, matiere, email } = req.body;

    try {
      const dernierEnseignant = await Enseignant.findOne({}, {}, { sort: { 'enseignantId': -1 } });
      const nouvelEnseignant = await Enseignant.create({
        enseignantId: dernierEnseignant ? dernierEnseignant.enseignantId + 1 : 1,
        nom,
        prenom,
        matiere,
        email,
      });

      res.status(201).json(nouvelEnseignant);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  updateEnseignant: async (req, res) => {
    const id = req.params.id;
    const { nom, prenom, matiere, email } = req.body;

    try {
      const enseignantMaj = await Enseignant.findByIdAndUpdate(id, {
        nom,
        prenom,
        matiere,
        email,
      }, { new: true });

      if (enseignantMaj) {
        res.status(200).json(enseignantMaj);
      } else {
        res.status(404).send('Enseignant non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  deleteEnseignant: async (req, res) => {
    const id = req.params.id;

    try {
      const enseignantSupprime = await Enseignant.findByIdAndDelete(id);

      if (enseignantSupprime) {
        res.status(200).json(enseignantSupprime);
      } else {
        res.status(404).send('Enseignant non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
};

module.exports = EnseignantController;
