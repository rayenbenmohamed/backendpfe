const Cours = require('../models/Cours');
const Etudiant = require('../models/Etudiant');

const CoursController = {
  getAllCours: async (req, res) => {
    try {
      const cours = await Cours.find();
      res.status(200).json(cours);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
  getEtudiantsInscrits: async (req, res) => {
    const coursId = req.params.id;

    try {
      const cours = await Cours.findById(coursId).populate('etudiantsInscrits');

      if (!cours) {
        console.log('Cours non trouvé');
        return res.status(404).send('Cours non trouvé');
      }

      console.log('Cours récupéré:', cours);

      
      const etudiantsAvecNomPrenom = await Promise.all(cours.etudiantsInscrits.map(async (etudiant) => {
        const etudiantDetails = await Etudiant.findById(etudiant);
        return {
          id: etudiantDetails.id,
          nom: etudiantDetails.nom,
          prenom: etudiantDetails.prenom,
        };
      }));

      console.log('Étudiants inscrits avec nom et prénom:', etudiantsAvecNomPrenom);

      res.status(200).json(etudiantsAvecNomPrenom);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },


  getCoursById: async (req, res) => {
    const id = req.params.id;

    try {
      const cours = await Cours.findById(id);

      if (cours) {
        res.status(200).json(cours);
      } else {
        res.status(404).send('Cours non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  createCours: async (req, res) => {
    const { coursId, nom, description, prix, etudiantId, image, categorieId } = req.body;

    try {
      let nouveauCours;

      if (etudiantId) {
        const etudiant = await Etudiant.findById(etudiantId);

        if (!etudiant) {
          return res.status(404).send('Etudiant non trouvé');
        }

        nouveauCours = await Cours.create({
          coursId,
          nom,
          description,
          prix,
          image,
          etudiantsInscrits: [etudiantId],
          categorie: categorieId ? categorieId : null,
        });
      } else {
        nouveauCours = await Cours.create({
          coursId,
          nom,
          description,
          prix,
          image,
          etudiantsInscrits: [],
          categorie: categorieId ? categorieId : null,
        });
      }

      res.status(201).json(nouveauCours);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
  

  updateCours: async (req, res) => {
    const id = req.params.id;
    const { nom, description, prix } = req.body;

    try {
      const coursMaj = await Cours.findByIdAndUpdate(
        id,
        { nom, description, prix },
        { new: true }
      );

      if (coursMaj) {
        res.status(200).json(coursMaj);
      } else {
        res.status(404).send('Cours non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  deleteCours: async (req, res) => {
    const id = req.params.id;

    try {
      const coursSupprime = await Cours.findByIdAndDelete(id);

      if (coursSupprime) {
        res.status(200).json(coursSupprime);
      } else {
        res.status(404).send('Cours non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  inscrireEtudiant: async (req, res) => {
    const coursId = req.params.id;
    const etudiantId = req.body.etudiantId;

    try {
      const cours = await Cours.findById(coursId);

      if (!cours) {
        return res.status(404).send('Cours non trouvé');
      }

      const etudiant = await Etudiant.findById(etudiantId);

      if (!etudiant) {
        return res.status(404).send('Etudiant non trouvé');
      }

      
      cours.etudiantsInscrits.push(etudiantId);

     
      await cours.save();

      res.status(200).json(cours);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
};

module.exports = CoursController;
