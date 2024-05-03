const Absence = require('../models/Absence');
const Module=require('../models/Module')

const AbsenceController = {
  getAllAbsences: async (req, res) => {
    try {
      const absences = await Absence.find();
      res.status(200).json(absences);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  getAbsenceById: async (req, res) => {
    const id = req.params.id;

    try {
      const absence = await Absence.findById(id);

      if (absence) {
        res.status(200).json(absence);
      } else {
        res.status(404).send('Absence non trouvée');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },

  createAbsence: async (req, res) => {
    const { moduleId } = req.params;
    const { etudiantsAbsents } = req.body;
  
    try {
      // Récupérer les informations sur le module
      const module = await Module.findById(moduleId);
      if (!module) {
        return res.status(404).json({ error: 'Module not found' });
      }
  
      // Créer une nouvelle absence pour ce module
      const absence = new Absence({
        nomModule: module.nomModule, // Nom du module récupéré automatiquement
        etudiantsAbsents
       
      });
  
      // Enregistrer l'absence dans la base de données
      const savedAbsence = await absence.save();
  
      // Ajouter l'ID de l'absence au module
      module.absences.push(savedAbsence._id);
      await module.save();
  
      res.status(201).json(savedAbsence);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Autres méthodes du contrôleur...
};

module.exports = AbsenceController;
