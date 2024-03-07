const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const EtudiantRoutes = require('./routes/Etudiant.route');
const EnseignantRoutes = require('./routes/Enseignant.route');

const EmploiRouter = require('./routes/Emploi.route');
const CategorieRoute=require('./routes/Categorie.route');
const FormationRoute=require('./routes/Formations.route');
const ModuleRoute=require('./routes/Module.route');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api', EtudiantRoutes);
app.use('/api', EnseignantRoutes);

app.use('/api', EmploiRouter);
app.use('/api',CategorieRoute);
app.use('/api',FormationRoute);
app.use('/api',ModuleRoute);

  

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
