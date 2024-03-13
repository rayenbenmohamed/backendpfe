
const Etudiant = require('../models/Etudiant');
const Compte=require( '../models/Compte');
const Module=require('../models/Module')


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
    const compteId = req.params.compteId;

    try {
      // Recherchez l'étudiant en fonction du compteId
      const etudiant = await Etudiant.findOne({ compte: compteId })
        .populate('compte');  // Populate pour obtenir les détails du compte

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
    const compteId = req.params.compteId;

    try {
        // Trouver l'étudiant avec le compte et ses formations
        const etudiant = await Etudiant.findOne({ compte: compteId })
            .populate('compte')
            .populate({
                path: 'formations',
                model: 'Formation',
            });

        if (etudiant) {
            // Extraire les détails de chaque formation
            const formations = etudiant.formations.map(formation => ({
                _id: formation._id,
                nomformation: formation.nomformation,
                duree: formation.duree,
                description: formation.description,
                prix: formation.prix,
                image: formation.image,
                niveau: formation.niveau,
                categorie: formation.categorie,
                // Ajoutez d'autres champs de formation au besoin
            }));

            res.status(200).json(formations);
        } else {
            res.status(404).send('Étudiant non trouvé pour ce compte');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
    }
},
  addFormationToEtudiant: async (req, res) => {
    const etudiantId = req.params.etudiantId;
    const { formationId } = req.body;

    try {
      const etudiant = await Etudiant.findById(etudiantId);

      if (!etudiant) {
        return res.status(404).send('Étudiant non trouvé');
      }

      // Ajouter l'ID de la formation au tableau de formations de l'étudiant
      etudiant.formations.push(formationId);

      // Enregistrez les modifications apportées à l'étudiant
      await etudiant.save();

      res.status(200).json(etudiant);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  createEtudiant: async (req, res) => {
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

      
      const nouveauCompte = await Compte.create({
        nomUtilisateur: email,
        motDePasse: 'motDePasseAleatoire',
        estActive: false,
      });

      // Mettre à jour l'étudiant avec la référence du compte et la formation
      nouvelEtudiant.compte = nouveauCompte._id;
      nouvelEtudiant.formations = [formationId];
      await nouvelEtudiant.save();

      res.status(201).json(nouvelEtudiant);
    } catch (error) {
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
getFormationByCompte: async (req, res) => {
  const compteId = req.params.compteId;

  try {
    // Trouver l'étudiant avec le compte
    const etudiant = await Etudiant.findOne({ compte: compteId })
      .populate('compte')
      .populate({
        path: 'formations',
        model: 'Formation',
      });

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
