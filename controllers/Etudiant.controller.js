
const Etudiant = require('../models/Etudiant');


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
      const etudiant = await Etudiant.findById(id);
      
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

  createEtudiant: async (req, res) => {
    const { nom, prenom, date_naissance, numTel, email, cin, niveauScolaire } = req.body;

    try {
        const dernierEtudiant = await Etudiant.findOne({}, {}, { sort: { 'etudiantId': -1 } });
        const nouvelEtudiant = await Etudiant.create({
            etudiantId: dernierEtudiant ? dernierEtudiant.etudiantId + 1 : 1,
            nom,
            prenom,
            date_naissance,
            numTel,
            email,
            cin,
            niveauScolaire,
        });

        res.status(201).json(nouvelEtudiant);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
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
}

module.exports = EtudiantController;
