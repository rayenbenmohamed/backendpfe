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
    // Rechercher l'utilisateur par nom d'utilisateur
    const compte = await Compte.findOne({ nomUtilisateur });
    if (!compte) {
      return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, compte.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
    }

    // Trouver l'étudiant associé à ce compte
    const etudiant = await Etudiant.findOne({ compte: compte._id });

    // Si l'étudiant n'est pas trouvé, retourner un message d'erreur
    if (!etudiant) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce compte." });
    }

    // Récupérer les modules associés à l'étudiant
    const module = await Module.findOne({ etudiants: etudiant._id }).exec();

    // Générer le token JWT si la vérification est réussie
    const token = jwt.sign(
      { id: compte._id, role: compte.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Expiration en 1 heure
    );

    // Répondre avec le token, le module et les informations sur le compte
    res.json({ token, module, compte: { nomUtilisateur: compte.nomUtilisateur, role: compte.role, estActive: compte.estActive } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


exports.getModuleInfo = async (req, res) => {
  try {
    // Trouver l'étudiant associé au compte de l'utilisateur authentifié
    const etudiant = await Etudiant.findOne({ compte: req.user.id }).populate('module');
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    // Si l'étudiant est trouvé mais n'a pas de module associé
    if (!etudiant.module) {
      return res.status(404).json({ message: 'Module non trouvé pour cet étudiant.' });
    }

    // Répondre avec les informations du module
    res.json(etudiant.module);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur.');
  }
};