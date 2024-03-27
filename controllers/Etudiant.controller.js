const Etudiant = require('../models/Etudiant');
const Compte = require('../models/Compte');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const EtudiantController = {
  getAllEtudiants: async (req, res) => {
    try {
      const etudiants = await Etudiant.find();
      res.status(200).json(etudiants);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getEtudiantById: async (req, res) => {
    const id = req.params.id;

    try {
      const etudiant = await Etudiant.findById(id).populate('compte');

      if (etudiant) {
        res.status(200).json(etudiant);
      } else {
        res.status(404).send('Etudiant non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getEtudiantByCompte: async (req, res) => {
    const id = req.params.id;

    try {
      const etudiant = await Etudiant.findOne({ compte: id }).populate('compte');

      if (etudiant) {
        res.status(200).json(etudiant);
      } else {
        res.status(404).send('Étudiant non trouvé pour ce compte');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getFormationByCompte: async (req, res) => {
    const compteId = req.params.id;

    try {
      const etudiant = await Etudiant.findOne({ compte: compteId }).populate('compte').populate('formations');

      if (etudiant) {
        res.status(200).json(etudiant.formations);
      } else {
        res.status(404).send('Étudiant non trouvé pour ce compte');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  addFormationToEtudiant: async (req, res) => {
    const id = req.params.id;
    const { formationId } = req.body;

    try {
      const etudiant = await Etudiant.findById(id);

      if (!etudiant) {
        return res.status(404).send('Étudiant non trouvé');
      }

      etudiant.formations.push(formationId);

      await etudiant.save();

      res.status(200).json(etudiant);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

   createEtudiant : async (req, res) => {
    const { nom, prenom, date_naissance, numTel, email, cin, niveauScolaire, formationId } = req.body;

  try {
    // Vérifier si l'email est déjà utilisé
    const existingEtudiant = await Etudiant.findOne({ email });
    if (existingEtudiant) {
      return res.status(400).json({ message: 'Cet e-mail est déjà utilisé.' });
    }

    // Vérifier si le CIN est déjà utilisé
    const existingCIN = await Etudiant.findOne({ cin });
    if (existingCIN) {
      return res.status(400).json({ message: 'Ce CIN est déjà utilisé.' });
    }

    // Créer un nouvel étudiant
    const nouvelEtudiant = await Etudiant.create({
      nom,
      prenom,
      date_naissance,
      numTel,
      email,
      cin,
      niveauScolaire,
    });
  } catch (error) {
    // Gérer les erreurs
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
  },
 
  updateEtudiant: async (req, res) => {
    const id = req.params.id;
    const { nom, prenom, date_naissance, numTel, email, cin, niveauScolaire } = req.body;
  
    try {
        const etudiantMaj = await Etudiant.findByIdAndUpdate(id, {
            nom,
            prenom,
            date_naissance,
            numTel,
            email,
            cin,
            niveauScolaire,
        }, { new: true });
  
        if (etudiantMaj) {
            res.status(200).json(etudiantMaj);
        } else {
            res.status(404).send('Etudiant non trouvé');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
  },
  addCompteToEtudiant: async (req, res) => {
    const id = req.params.id; // Récupérer l'ID de l'étudiant de l'URL
    const { compteId } = req.body; // Récupérer l'ID du compte à associer à l'étudiant

    try {
        // Vérifier si l'étudiant existe
        const etudiant = await Etudiant.findById(id);
        if (!etudiant) {
            return res.status(404).send('Étudiant non trouvé');
        }

        // Associer le compte au champ `compte` de l'étudiant
        etudiant.compte = compteId;
        await etudiant.save();

        res.status(200).json(etudiant);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
},
deleteCompteFromEtudiant: async (req, res) => {
  const etudiantId = req.params.id; // L'ID de l'étudiant est passé dans l'URL

  try {
      const etudiant = await Etudiant.findById(etudiantId);
      if (!etudiant) {
          return res.status(404).send('Étudiant non trouvé');
      }

      const compteId = etudiant.compte; // Assumer que `compte` est l'ID du compte associé
      if (!compteId) {
          return res.status(404).send('Compte non trouvé pour cet étudiant');
      }

      // Supprimer le compte associé
      await Compte.findByIdAndDelete(compteId);

      // Option 1: Supprimer la référence au compte dans l'objet étudiant
      etudiant.compte = null;
      await etudiant.save();

      // Option 2: Supprimer également l'étudiant si vous le souhaitez
      // await Etudiant.findByIdAndDelete(etudiantId);

      res.status(200).send('Compte et/ou étudiant supprimé avec succès');
  } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
  }
},



  deleteEtudiant: async (req, res) => {
    const id = req.params.id;

    try {
      const etudiantSupprime = await Etudiant.findByIdAndDelete(id);

      if (etudiantSupprime) {
        res.status(200).json(etudiantSupprime);
      } else {
        res.status(404).send('Etudiant non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
};

module.exports = EtudiantController;
