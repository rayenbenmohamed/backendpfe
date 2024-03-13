const express=require('express');
const router= express.Router();
 const Etudiantcontroller=require('../controllers/Etudiant.controller');
 const CompteController=require('../controllers/Compte.controller');
const Modulecontroller=require('../controllers/Module.controller');


 router.get('/etudiants',Etudiantcontroller.getAllEtudiants);

 router.get('/etudiants/:id',Etudiantcontroller.getEtudiantById );

 router.post('/etudiants',Etudiantcontroller.createEtudiant);

 router.put('/etudiants/:id',Etudiantcontroller.updateEtudiant);

 router.delete('/etudiants/:id',Etudiantcontroller.deleteEtudiant);

 router.put('/comptes/:id/activer', CompteController.activerCompte);
 router.get('/etudiants/formation/:compteId', Etudiantcontroller.getFormationByCompte);
 router.get('/etudiants/byCompte/:compteId', Etudiantcontroller.getEtudiantByCompte);
 router.get('/modules/byEtudiant/:etudiantId', Modulecontroller.getModulesByEtudiantId);

 router.post('/etudiants/:etudiantId/formations', Etudiantcontroller.addFormationToEtudiant);

 

 
 module.exports=router
