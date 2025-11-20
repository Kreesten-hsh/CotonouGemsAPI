// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Charger les variables du .env
dotenv.config();

const app = express();

// Middlewares
app.use(express.json()); 
app.use(cors()); // Permet à Flutter de communiquer avec l'API

// Définition de la route pour les établissements
app.use('/api/etablissements', require('./routes/etablissements'));

// Connexion à la base de données
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Atlas connecté avec succès !');
        
        // Démarrer le serveur Express
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`🚀 Serveur Express démarré sur le port ${PORT}`));

    } catch (err) {
        console.error('❌ Erreur de connexion à la base de données :', err.message);
        process.exit(1);
    }
};

connectDB();