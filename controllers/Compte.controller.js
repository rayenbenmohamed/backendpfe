const Compte = require('../models/Compte');

const CompteController = {
  
  activerCompte: async (req, res) => {
    const id = req.params.id;

    try {
      const compte = await Compte.findByIdAndUpdate(id, { estActive: true }, { new: true });

      if (compte) {
        res.status(200).json(compte);
      } else {
        res.status(404).send('Compte non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
  addImageToCompte: async (req, res) => {
    const { id } = req.params;  // Assuming the compte's ID is passed as a URL parameter
    const imageUrl = req.cloudinaryUrl || '';

    try {
      const compte = await Compte.findByIdAndUpdate(id, { imageUrl: imageUrl }, { new: true });
      if (compte) {
        res.status(200).json(compte);
      } else {
        res.status(404).send('Compte not found');
      }
    } catch (error) {
      console.error('Error updating compte:', error);
      res.status(500).send('Erreur serveur');
    }
  }
};

module.exports = CompteController;
