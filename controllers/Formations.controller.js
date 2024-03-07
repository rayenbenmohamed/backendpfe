const Formation = require('../models/Formation');

const FormationController = {
  getAllFormations: async (req, res) => {
    try {
      const formations = await Formation.find().populate('categorie');
      res.status(200).json(formations);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getFormationById: async (req, res) => {
    const id = req.params.id;

    try {
      const formation = await Formation.findById(id).populate('categorie');

      if (formation) {
        res.status(200).json(formation);
      } else {
        res.status(404).send('Formation non trouvée');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  createFormation: async (req, res) => {
    const { nomformation, duree, description, prix, image, niveau, categorie } = req.body;

    try {
      const nouvelleFormation = await Formation.create({
        nomformation,
        duree,
        description,
        prix,
        image,
        niveau,
        categorie,
      });

      res.status(201).json(nouvelleFormation);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  updateFormation: async (req, res) => {
    const id = req.params.id;
    const { nomformation, duree, description, prix, image, niveau, categorie } = req.body;

    try {
      const formationMaj = await Formation.findByIdAndUpdate(
        id,
        { nomformation, duree, description, prix, image, niveau, categorie },
        { new: true }
      ).populate('categorie');

      if (formationMaj) {
        res.status(200).json(formationMaj);
      } else {
        res.status(404).send('Formation non trouvée');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  deleteFormation: async (req, res) => {
    const id = req.params.id;

    try {
      const formationSupprime = await Formation.findByIdAndDelete(id).populate('categorie');

      if (formationSupprime) {
        res.status(200).json(formationSupprime);
      } else {
        res.status(404).send('Formation non trouvée');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
};

module.exports = FormationController;
