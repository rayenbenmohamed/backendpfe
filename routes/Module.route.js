const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/Module.controller');


router.get('/modules', moduleController.getAllModules);


router.get('/modules/:id', moduleController.getModuleById);


router.post('/modules', moduleController.createModule);


router.put('/modules/:id', moduleController.updateModule);


router.delete('/modules/:id', moduleController.deleteModule);

module.exports = router;
