const express = require('express');
const router = express.Router();
const Etablissement = require('../models/Etablissement');


// @route   POST /api/etablissements
// @desc    Ajouter un nouvel établissement
// @access  Public (pour l'instant, mais deviendra 'Private/Admin' plus tard)
router.post('/', async (req, res) => {
    try {
        // Crée une nouvelle instance de l'établissement avec les données envoyées par Flutter (req.body)
        const nouvelEtablissement = new Etablissement(req.body);

        // Sauvegarde l'établissement dans MongoDB Atlas
        const etablissementSauve = await nouvelEtablissement.save();

        // Répond à Flutter avec l'objet créé
        res.status(201).json(etablissementSauve); // 201 = Créé avec succès

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du Serveur'); // 500 = Erreur interne
    }
});

router.get('/', async (req, res) => {
    try {
        // --- 1. Construction du Filtre de Base (l'objet 'query') ---
        let query = {};

        // 1.1 FILTRE BUDGETAIRE (prixMax)
        if (req.query.prixMax) {
            // Utilise l'opérateur MongoDB $lte (less than or equal) sur le champ prixMoyen
            query.prixMoyen = { $lte: parseInt(req.query.prixMax) };
        }

        // 1.2 FILTRE PAR TAGS D'AMBIANCE (ambiance)
        if (req.query.ambiance) {
            // Le client enverra les tags séparés par des virgules (ex: "date en amoureux,musique live")
            const tags = req.query.ambiance.split(',').map(tag => tag.trim());
            
            // Utilise l'opérateur $in (pour trouver un établissement qui contient au moins un des tags)
            // OU l'opérateur $all (si vous voulez qu'il contienne TOUS les tags)
            query.ambianceTags = { $in: tags }; 
        }

        // 1.3 FILTRE PAR CUISINE (cuisine)
        if (req.query.cuisine) {
            const cuisines = req.query.cuisine.split(',').map(c => c.trim());
            query.typeCuisine = { $in: cuisines };
        }
        
        // 1.4 FILTRES BOOLÉENS (services: wifi, parking, etc.)
        if (req.query.wifi === 'true') {
            query['services.wifi'] = true;
        }
        if (req.query.parking === 'true') {
            query['services.parking'] = true;
        }
        // ... ajoutez les autres filtres booléens ici

        // --- 2. EXÉCUTION DE LA REQUÊTE ---
        
        let etablissements = Etablissement.find(query);
        
        // --- 3. OPTIONS AVANCÉES (Trier les résultats) ---
        if (req.query.sort) {
            // Permet de trier par prix, note, etc. (ex: sort=prixMoyen)
            etablissements = etablissements.sort(req.query.sort);
        } else {
            // Tri par défaut (par exemple, du plus récent au plus ancien)
            etablissements = etablissements.sort('-createdAt');
        }

        // --- 4. ENVOI DES RÉSULTATS ---
        const results = await etablissements;
        res.json(results);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur Serveur lors de la recherche.');
    }
});

module.exports = router;