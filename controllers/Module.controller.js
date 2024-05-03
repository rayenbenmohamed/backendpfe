  const Module = require('../models/Module');
  const Enseignant = require('../models/Enseignant');
  const Formation = require('../models/Formation');
  const Etudiant = require('../models/Etudiant');
  const Emploi = require('../models/Emploi');

  const ModuleController = {
    getAllModules: async (req, res) => {
      try {
        const modules = await Module.find()
          .populate('enseignant')
          .populate('formations')
          .populate('etudiants')
          .populate('emploi');

        res.status(200).json(modules);
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },

    getModuleById: async (req, res) => {
      const id = req.params.id;

      try {
        const module = await Module.findById(id)
          .populate('enseignant')
          .populate('formations')
          .populate('etudiants')
          .populate('emploi');


        if (module) {
          res.status(200).json(module);
        } else {
          res.status(404).send('Module non trouvé');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },

    createModule: async (req, res) => {
      const { nomModule, enseignantId, formationsId, emploi } = req.body;

      try {
        const newModule = await Module.create({
          nomModule,
          enseignant: enseignantId,
          formations: formationsId,
          emploi,
          documents: [] 
        });

        // Si l'enseignant existe, ajoutez le module à sa liste
        if (enseignantId) {
          const enseignant = await Enseignant.findById(enseignantId);
          if (enseignant) {
            enseignant.modules = enseignant.modules || [];
            enseignant.modules.push(newModule._id);
            await enseignant.save();
          }
        }

        // Si la formation existe, ajoutez le module à sa liste
        if (formationsId) {
          const formations = await Formation.findById(formationsId);
          if (formations) {
            formations.modules = formations.modules || [];
            formations.modules.push(newModule._id);
            await formations.save();
          }
        }

        res.status(201).json(newModule);
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },

    updateModule: async (req, res) => {
      const id = req.params.id;
      const { nomModule, enseignantId, formationsId, emploi } = req.body;

      try {
        const updatedModule = await Module.findByIdAndUpdate(
          id,
          { nomModule, enseignant: enseignantId, formations: formationsId, emploi },
          { new: true }
        ).populate('enseignant').populate('formations').populate('etudiants').populate('emploi');

        if (updatedModule) {
          res.status(200).json(updatedModule);
        } else {
          res.status(404).send('Module non trouvé');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },

    addStudentToGroup: async (req, res) => {
      const moduleId = req.params.moduleId;
      const etudiantId = req.params.etudiantId;

      try {
        const module = await Module.findById(moduleId);

        if (!module) {
          return res.status(404).send('Module non trouvé');
        }

        const etudiant = await Etudiant.findById(etudiantId);

        if (!etudiant) {
          return res.status(404).send('Étudiant non trouvé');
        }

        // Vérifier si l'étudiant est déjà dans la liste des étudiants du module
        if (!module.etudiants.includes(etudiant._id)) {
          // Ajouter l'étudiant au groupe
          module.etudiants = module.etudiants || [];
          module.etudiants.push(etudiant._id);

          // Vérifier si la formation du module est déjà dans la liste des formations de l'étudiant
          if (!etudiant.formations.includes(module.formations)) {
            // Ajouter la formation du module à la liste des formations de l'étudiant
            etudiant.formations = etudiant.formations || [];
            etudiant.formations.push(module.formations);
          }

          await module.save();
          await etudiant.save();

          res.status(200).json(module);
        } else {
          // Si l'étudiant est déjà dans la liste, renvoyer un message approprié
          res.status(200).send('L\'étudiant est déjà dans le groupe');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },
    removeStudentFromGroup: async (req, res) => {
      const moduleId = req.params.moduleId;
      const etudiantId = req.params.etudiantId;
    
      try {
        const module = await Module.findById(moduleId);
    
        if (!module) {
          return res.status(404).send('Module non trouvé');
        }
    
        const etudiant = await Etudiant.findById(etudiantId);
    
        if (!etudiant) {
          return res.status(404).send('Étudiant non trouvé');
        }
    
        // Vérifier si l'étudiant est dans la liste des étudiants du module
        const studentIndex = module.etudiants.indexOf(etudiant._id);
        if (studentIndex !== -1) {
          // Retirer l'étudiant du groupe
          module.etudiants.splice(studentIndex, 1);
    
          // Retirer la formation du module de la liste des formations de l'étudiant
          const formationIndex = etudiant.formations.indexOf(module.formations);
          if (formationIndex !== -1) {
            etudiant.formations.splice(formationIndex, 1);
          }
    
          await module.save();
          await etudiant.save();
    
          res.status(200).json(module);
        } else {
          // Si l'étudiant n'est pas dans la liste, renvoyer un message approprié
          res.status(404).send('L\'étudiant n\'est pas dans le groupe');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },
    deleteModule: async (req, res) => {
      const id = req.params.id;

      try {
        const deletedModule = await Module.findByIdAndDelete(id);
        if (deletedModule) {
          res.status(200).json({ message: 'Module supprimé avec succès' });
        } else {
          res.status(404).send('Module non trouvé');
        }
      } catch (error) {
        console.error(error);
        res.status(500).send('Erreur serveur');
      }
    },
    addEmploiToModule: async (req, res) => {
      const moduleId = req.params.moduleId;
      const emploiId = req.params.emploiId;
    
      try {
        const module = await Module.findById(moduleId);
    
        if (!module) {
          return res.status(404).send('Module not found');
        }
    
        // Assign the emploi to the module
        module.emploi = emploiId;
        await module.save();
    
        res.status(200).json(module);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    },
    getStudentsNotInModule: async (req, res) => {
      const moduleId = req.params.moduleId;
    
      try {
        // Find the module by ID
        const module = await Module.findById(moduleId);
    
        if (!module) {
          return res.status(404).send('Module not found');
        }
    
        // Find all students who are not in the module
        const studentsNotInModule = await Etudiant.find({ _id: { $nin: module.etudiants } });
    
        res.status(200).json(studentsNotInModule);
      } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
      }
    },
    deleteEmploiFromModule: async (req, res) => {
      const { moduleId, emploiId } = req.params;
      try {
        // Remove emploi from the module
        await Module.findByIdAndUpdate(moduleId, { $unset: { emploi: "" } });
        
        // Delete emploi from the database
        const deletedEmploi = await Emploi.findByIdAndDelete(emploiId);
        if (!deletedEmploi) {
          return res.status(404).send('Emploi not found');
        }
        
        res.status(200).send({ message: 'Emploi removed from module and deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    
    },
    addDocumentToModule :async (req, res) => {
      const { moduleId } = req.params;
      const { fileName, description } = req.body;
    
      try {
        // Find the module by ID and update it by pushing a new document into the documents array
        const module = await Module.findByIdAndUpdate(moduleId, {
          $push: { documents: { fileName, description } }
        }, { new: true });  // Return the updated module document
    
        if (!module) {
          return res.status(404).send('Module not found');
        }
    
        res.status(200).json({ success: true, data: module });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    }
    
  }; module.exports = ModuleController;
