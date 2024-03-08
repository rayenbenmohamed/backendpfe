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
};

module.exports = CompteController;
