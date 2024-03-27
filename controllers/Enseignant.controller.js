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
    const { nom, prenom, email, cin, certificat, compteId } = req.body;
  
    try {
      // Assurez-vous que le compteId est fourni et valide
     
  
      const nouvelEnseignant = await Enseignant.create({
        nom,
        prenom,
        email,
        cin,
        certificat,
        compte: compteId, // Associez le compte ici
      });
  
      res.status(201).json(nouvelEnseignant);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
  addCompteToEnseignant: async (req, res) => {
    const id = req.params.id; // Récupérer l'ID de l'enseignant de l'URL
    const { compteId } = req.body; // Récupérer l'ID du compte à associer à l'enseignant

    try {
        // Vérifier si l'enseignant existe
        const enseignant = await Enseignant.findById(id);
        if (!enseignant) {
            return res.status(404).send('Enseignant non trouvé');
        }

        // Associer le compte au champ `compte` de l'enseignant
        enseignant.compte = compteId;
        await enseignant.save();

        res.status(200).json(enseignant);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
  },

  deleteCompteFromEnseignant: async (req, res) => {
    const enseignantId = req.params.id; // L'ID de l'enseignant est passé dans l'URL

    try {
        const enseignant = await Enseignant.findById(enseignantId);
        if (!enseignant) {
            return res.status(404).send('Enseignant non trouvé');
        }

        const compteId = enseignant.compte; // Assumer que `compte` est l'ID du compte associé
        if (!compteId) {
            return res.status(404).send('Compte non trouvé pour cet enseignant');
        }

        // Supprimer le compte associé
        await Compte.findByIdAndDelete(compteId);

        // Supprimer la référence au compte dans l'objet enseignant
        enseignant.compte = null;
        await enseignant.save();

        res.status(200).send('Compte et/ou enseignant supprimé avec succès');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
  },

  updateEnseignant: async (req, res) => {
    const id = req.params.id;
    const { nom, prenom, email, cin, certificat, compteId } = req.body;
  
    try {
      const enseignantMaj = await Enseignant.findByIdAndUpdate(id, {
        nom,
        prenom,
        email,
        cin,
        certificat,
        compte: compteId, // Permettre la mise à jour du compte
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
