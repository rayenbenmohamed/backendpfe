// controllers/Emploi.controller.js
const Emploi = require('../models/Emploi');
const Cours = require('../models/Cours');

const EmploiController = {
  createEmploi: async (req, res) => {
    const { emploiId, horaire, date, coursId } = req.body;

    try {
      const cours = await Cours.findById(coursId);

      if (!cours) {
        return res.status(404).send('Cours non trouvé');
      }

      const nouvelEmploi = await Emploi.create({
        emploiId,
        horaire,
        date,
        cours: cours._id,
      });

      res.status(201).json(nouvelEmploi);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getEmploiByCoursId: async (req, res) => {
    const coursId = req.params.id;

    try {
      const emploi = await Emploi.findOne({ cours: coursId });

      if (!emploi) {
        return res.status(404).send('Emploi non trouvé pour ce cours');
      }

      res.status(200).json(emploi);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getAllEmplois: async (req, res) => {
    try {
      const emplois = await Emploi.find();
      res.status(200).json(emplois);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  updateEmploi: async (req, res) => {
    const emploiId = req.params.id;
    const { horaire, date } = req.body;

    try {
      const emploiMaj = await Emploi.findByIdAndUpdate(
        emploiId,
        { horaire, date },
        { new: true }
      );

      if (emploiMaj) {
        res.status(200).json(emploiMaj);
      } else {
        res.status(404).send('Emploi non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  deleteEmploi: async (req, res) => {
    const emploiId = req.params.id;

    try {
      const emploiSupprime = await Emploi.findByIdAndDelete(emploiId);

      if (emploiSupprime) {
        res.status(200).json(emploiSupprime);
      } else {
        res.status(404).send('Emploi non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
};

module.exports = EmploiController;
