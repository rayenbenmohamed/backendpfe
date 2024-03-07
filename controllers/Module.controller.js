const Module = require('../models/Module');
const Enseignant = require('../models/Enseignant');
const Formation = require('../models/Formation');

const ModuleController = {
  getAllModules: async (req, res) => {
    try {
      const modules = await Module.find()
        .populate('enseignant')
        .populate('formations')
        .populate('etudiants')
        .populate('emplois');

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
        .populate('emplois');

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
    const { nomModule, enseignantId, formationsId, emplois } = req.body;

    try {
      const newModule = await Module.create({
        nomModule,
        enseignant: enseignantId,
        formations: formationsId,
        emplois,
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
    const { nomModule, enseignantId, formationsId, emplois } = req.body;

    try {
      const updatedModule = await Module.findByIdAndUpdate(
        id,
        { nomModule, enseignant: enseignantId, formations: formationsId, emplois },
        { new: true }
      ).populate('enseignant').populate('formations').populate('etudiants').populate('emplois');

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

  deleteModule: async (req, res) => {
    const id = req.params.id;

    try {
      const deletedModule = await Module.findByIdAndDelete(id)
        .populate('enseignant')
        .populate('formations')
        .populate('etudiants')
        .populate('emplois');

      if (deletedModule) {
        // Si l'enseignant existe, retirez le module de sa liste
        if (deletedModule.enseignant) {
          await Enseignant.findByIdAndUpdate(deletedModule.enseignant, { $pull: { modules: deletedModule._id } });
        }

        // Si la formation existe, retirez le module de sa liste
        if (deletedModule.formations) {
          await Formation.findByIdAndUpdate(deletedModule.formations, { $pull: { modules: deletedModule._id } });
        }

        res.status(200).json(deletedModule);
      } else {
        res.status(404).send('Module non trouvé');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  },
};

module.exports = ModuleController;
