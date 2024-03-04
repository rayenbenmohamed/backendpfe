const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const EtudiantRoutes = require('./routes/Etudiant.route');
const EnseignantRoutes = require('./routes/Enseignant.route');
const CoursRouter = require('./routes/Cours.route');
const EmploiRouter = require('./routes/Emploi.route');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/api', EtudiantRoutes);
app.use('/api', EnseignantRoutes);
app.use('/api', CoursRouter);
app.use('/api', EmploiRouter);

  

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
