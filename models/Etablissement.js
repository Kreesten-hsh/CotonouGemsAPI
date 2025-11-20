// models/Etablissement.js

const mongoose = require('mongoose');

const etablissementSchema = new mongoose.Schema({
    // --- Infos de Base ---
    nom: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    adresse: { type: String, required: true, trim: true },
    telephone: String,
    
    // --- Catégories & Niche ---
    categorie: { // Ex: 'Restaurant', 'Activité', 'Bar/Lounge'
        type: String,
        required: true,
        enum: ['Restaurant', 'Bar/Lounge', 'Activité', 'Détente', 'Événement'], 
        default: 'Restaurant'
    },
    sousCategorie: String,
    
    // --- Filtres Expérience ---
    prixMoyen: { type: Number, required: true, min: 0 }, // Budget moyen par personne
    typeCuisine: { type: [String], default: [], lowercase: true },
    ambianceTags: { // Ex: 'date en amoureux', 'musique live'
        type: [String], 
        default: [],
        lowercase: true,
    },

    // --- Services ---
    services: {
        wifi: { type: Boolean, default: false },
        parking: { type: Boolean, default: false },
        climatisation: { type: Boolean, default: false },
        carteBancaire: { type: Boolean, default: false },
        reservation: { type: Boolean, default: false },
    },

    // --- Médias & Vibe Check ---
    images: [String], // Tableau d'URLs des photos
    videoUrl: String, // URL de la vidéo verticale pour le Vibe Feed
    
    // --- Localisation ---
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [Longitude, Latitude]
    },

    // --- Statistiques ---
    noteGlobaleMoyenne: { type: Number, default: 0 },
}, {
    timestamps: true 
});

etablissementSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Etablissement', etablissementSchema);