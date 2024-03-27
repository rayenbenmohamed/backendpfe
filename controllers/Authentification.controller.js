// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Compte = require('../models/Compte'); // Assurez-vous que le chemin est correct
const EtudiantController= require('../controllers/Etudiant.controller')
const Etudiant =require('../models/Etudiant')
const Module = require('../models/Module');
const Enseignant = require('../models/Enseignant');


  exports.register = async (req, res) => {
    const { nomUtilisateur, motDePasse, role } = req.body;
    try {
      let utilisateur = await Compte.findOne({ nomUtilisateur });
      if (utilisateur) {
        return res.status(400).send('Utilisateur déjà existant.');
      }

      const hashedPassword = await bcrypt.hash(motDePasse, 10);
      utilisateur = new Compte({
        nomUtilisateur,
        motDePasse: hashedPassword,
        role
      });

      await utilisateur.save();

      // Générer le token
      const token = jwt.sign({ _id: utilisateur._id, role: utilisateur.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

      // Stocker le token dans le modèle de compte
      utilisateur.token = token;
      await utilisateur.save();

      res.status(201).send({ token });
    } catch (error) {
      res.status(500).send('Erreur serveur.');
    }
  };


exports.login = async (req, res) => {
  const { nomUtilisateur, motDePasse } = req.body;

  try {
    const compte = await Compte.findOne({ nomUtilisateur });
    if (!compte) {
      return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    const isMatch = await bcrypt.compare(motDePasse, compte.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Générer le token JWT si la vérification est réussie
    const token = jwt.sign(
      { id: compte._id, role: compte.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    let modules = [];
    if (compte.role === 'candidat') {
      // Trouver l'étudiant associé à ce compte et récupérer les modules auxquels il est inscrit
      const etudiant = await Etudiant.findOne({ compte: compte._id });
      if (etudiant) {
        modules = await Module.find({ etudiants: etudiant._id }).populate('formations emploi enseignant').exec();
      }
    } else if (compte.role === 'formateur') {
      // Trouver l'enseignant associé à ce compte et récupérer les modules qu'il enseigne
      const enseignant = await Enseignant.findOne({ compte: compte._id });
      if (enseignant) {
        modules = await Module.find({ enseignant: enseignant._id }).populate('formations emploi etudiants').exec();
      }
    }

    // Construire la réponse
    const response = {
      token,
      modules, // Modules auxquels l'étudiant est inscrit ou que l'enseignant enseigne
      compte: { // Informations du compte
        nomUtilisateur: compte.nomUtilisateur,
        role: compte.role,
        estActive: compte.estActive
      }
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
},


  exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const compteId = req.params.id; // Récupération de l'ID du compte depuis les paramètres de la route

        // Recherche du compte par son ID
        const compte = await Compte.findById(compteId);

        if (!compte) {
            return res.status(404).json({ message: 'Compte non trouvé' });
        }

        // Vérification de l'ancien mot de passe
        const isMatch = await bcrypt.compare(oldPassword, compte.motDePasse);
        if (!isMatch) {
            return res.status(400).json({ message: 'L\'ancien mot de passe est incorrect' });
        }

        // Hashage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Mise à jour du mot de passe dans la base de données
        compte.motDePasse = hashedPassword;
        await compte.save();

        res.status(200).json({ message: 'Mot de passe changé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur du serveur' });
    }
};


