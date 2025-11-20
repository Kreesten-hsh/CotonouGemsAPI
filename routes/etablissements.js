// routes/etablissements.js

const express = require('express');
const router = express.Router();
const Etablissement = require('../models/Etablissement'); 

// @route   POST /api/etablissements (AJOUTER un établissement)
router.post('/', async (req, res) => {
    try {
        const nouvelEtablissement = new Etablissement(req.body);
        const etablissementSauve = await nouvelEtablissement.save();
        res.status(201).json(etablissementSauve); 

    } catch (err) {
        console.error("Erreur POST:", err.message);
        // Une erreur 400 est souvent due à un champ 'required' manquant dans le JSON
        res.status(400).send('Erreur: Données incomplètes ou mal formatées.'); 
    }
});

// @route   GET /api/etablissements (RECHERCHE & FILTRAGE)
router.get('/', async (req, res) => {
    try {
        let query = {};

        // FILTRE prixMax (Budget)
        if (req.query.prixMax) {
            query.prixMoyen = { $lte: parseInt(req.query.prixMax) };
        }
        // FILTRE ambianceTags (Mood Matcher)
        if (req.query.ambiance) {
            const tags = req.query.ambiance.split(',').map(tag => tag.trim());
            query.ambianceTags = { $in: tags }; 
        }
        // FILTRE par Catégorie
        if (req.query.categorie) {
            query.categorie = req.query.categorie;
        }
        // FILTRE Spécial pour le Vibe Feed (ne renvoie que ceux qui ont une vidéo)
        if (req.query.hasVideo === 'true') {
            query.videoUrl = { $exists: true, $ne: null };
        }
        
        // Exécution de la requête, tri par défaut par date
        const etablissements = await Etablissement.find(query).sort('-createdAt'); 

        res.json(etablissements);

    } catch (err) {
        console.error("Erreur GET:", err.message);
        res.status(500).send('Erreur du Serveur lors de la recherche.');
    }
});

module.exports = router;