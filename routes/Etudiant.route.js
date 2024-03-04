const express=require('express');
const router= express.Router();
 const Etudiantcontroller=require('../controllers/Etudiant.controller');



 router.get('/etudiants',Etudiantcontroller.getAllEtudiants);

 router.get('/etudiants/:id',Etudiantcontroller.getEtudiantById );

 router.post('/etudiants',Etudiantcontroller.createEtudiant);

 router.put('/etudiants/:id',Etudiantcontroller.updateEtudiant);

 router.delete('/etudiants/:id',Etudiantcontroller.deleteEtudiant);
 
 module.exports=router
