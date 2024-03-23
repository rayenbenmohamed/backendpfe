const express = require('express');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:4200', // Adaptez selon votre frontend
};
app.use(cors(corsOptions));

app.use(morgan('dev'));

// Importation des routes
const EtudiantRoutes = require('./routes/Etudiant.route');
const EnseignantRoutes = require('./routes/Enseignant.route');
const EmploiRouter = require('./routes/Emploi.route');
const CategorieRoute = require('./routes/Categorie.route');
const FormationRoute = require('./routes/Formations.route');
const ModuleRoute = require('./routes/Module.route');
const AuthController = require('./routes/auth.routes');

// Utilisation des routes
app.use('/api', EtudiantRoutes);
app.use('/api', AuthController);
app.use('/api', EnseignantRoutes);
app.use('/api', EmploiRouter);
app.use('/api', CategorieRoute);
app.use('/api', FormationRoute);
app.use('/api', ModuleRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
