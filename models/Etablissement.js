const mongoose = require('mongoose');

// --- 1. Définition du Schéma pour Cotonou Gems ---
const etablissementSchema = new mongoose.Schema({
    // --- Informations de Base ---
    nom: {
        type: String,
        required: true,
        trim: true 
    },
    description: {
        type: String,
        required: true
    },
    adresse: {
        type: String,
        required: true,
        trim: true
    },
    telephone: String,
    
    // --- 2. Localisation (CRUCIAL pour la recherche de proximité) ---
    location: {
        type: {
            type: String,
            enum: ['Point'], 
            default: 'Point',
        },
        // IMPORTANT: L'ordre est [Longitude, Latitude] pour MongoDB !
        coordinates: { 
            type: [Number],
            required: true,
        },
    },

    // --- 3. Filtres Financiers et Catégoriels ---
    prixMoyen: {
        type: Number, // Prix moyen estimé par personne en XOF
        required: true,
        min: 0
    },
    typeCuisine: {
        type: [String], // Array de tags (ex: 'Béninoise', 'Italienne')
        default: [],
        lowercase: true
    },

    // --- 4. Filtres d'Expérience (Vos USPs) ---
    ambianceTags: {
        type: [String], // Tags pour les filtres complexes (Date, Amis, etc.)
        default: [],
        lowercase: true,
        enum: [
            'date en amoureux', 
            'sortie entre amis', 
            'afterwork',
            'musique live',
            'vue sur mer', 
            'calme',
            'télétravail' 
        ]
    },

    // --- 5. Services et Praticité ---
    services: {
        wifi: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        climatisation: { type: Boolean, default: false },
        carteBancaire: { type: Boolean, default: false },
        reservation: { type: Boolean, default: false },
    },

    // --- 6. Autres Données et Statistiques ---
    horaires: Object, // Un objet pour stocker les horaires détaillés
    images: [String], // Tableau d'URLs des photos
    
    // Champs pour les notes moyennes (seront mis à jour par une fonction)
    noteAmbianceMoyenne: { type: Number, default: 0 },
    noteServiceMoyenne: { type: Number, default: 0 },
    noteGlobaleMoyenne: { type: Number, default: 0 },
}, {
    timestamps: true // Ajoute les champs createdAt et updatedAt
});

// --- 7. Indexation (Accélère la recherche "Autour de Moi") ---
etablissementSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Etablissement', etablissementSchema);