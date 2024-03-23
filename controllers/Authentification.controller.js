// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Compte = require('../models/Compte'); // Assurez-vous que le chemin est correct
const EtudiantController= require('../controllers/Etudiant.controller')
const Etudiant =require('../models/Etudiant')
const Module = require('../models/Module');

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
    // Recherche du compte correspondant au nom d'utilisateur
    const compte = await Compte.findOne({ nomUtilisateur });

    if (!compte) {
      return res.status(400).send('Nom d\'utilisateur incorrect.');
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(motDePasse, compte.motDePasse);

    if (!isMatch) {
      return res.status(400).send('Mot de passe incorrect.');
    }

    // Recherche de l'étudiant associé au compte
    const etudiant = await Etudiant.findOne({ compte: compte._id });

    if (!etudiant) {
      return res.status(404).send('Étudiant non trouvé.');
    }

    // Récupération du module de l'étudiant
    const module = await Module.findOne({ etudiants: etudiant._id });

    if (!module) {
      return res.status(404).send('Module non trouvé pour cet étudiant.');
    }

    // Création du token JWT
    const token = jwt.sign({ _id: compte._id, role: compte.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.send({ token, module, etudiant  });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur.');
  }
};