// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // Essentiel pour la connexion depuis Flutter

// --- 1. CONFIGURATION INITIALE ---
// Charge les variables du fichier .env dans process.env
dotenv.config();

const app = express();

// --- 2. MIDDLEWARES ---
// Permet de traiter les données JSON envoyées par les clients (Flutter)
app.use(express.json()); 

// Permet aux requêtes de Flutter d'accéder à l'API (très important en développement)
app.use(cors()); 

// --- 3. CONNEXION À LA BASE DE DONNÉES ---
const connectDB = async () => {
    try {
        // Mongoose utilise MONGO_URI pour se connecter à Atlas
        await mongoose.connect(process.env.MONGO_URI, {
            // Options de connexion recommandées (déjà incluses dans l'URI générée, mais bonnes à savoir)
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Atlas connecté avec succès !');
        
        // --- 4. DÉMARRAGE DU SERVEUR EXPRESS ---
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Serveur Express démarré sur le port ${PORT}`));

    } catch (err) {
        // En cas d'échec (mauvais mot de passe, mauvaise IP, etc.)
        console.error('❌ Erreur de connexion à la base de données :', err.message);
        process.exit(1); // Quitter le processus pour indiquer une erreur fatale
    }
};

// --- 5. ROUTES ---
app.use('/api/etablissements', require('./routes/etablissements'));

connectDB();