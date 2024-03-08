etudiantSchema.pre('save', async function (next) {
    try {
      if (!this.etudiantId) {
        // Générer et attribuer automatiquement un nouveau etudiantId si non défini
        const count = await Etudiant.countDocuments({});
        this.etudiantId = count + 1;
      }
  
      next();
    } catch (error) {
      next(error);
    }
  });
  