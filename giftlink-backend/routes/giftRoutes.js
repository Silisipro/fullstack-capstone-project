
const express = require('express');
const connectToDatabase = require('../db'); 

const router = express.Router();

// Récupérer tous les cadeaux
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        const gifts = await collection.find({}).toArray();

        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

// Récupérer un cadeau spécifique par ID
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        const id = req.params.id;

        const gift = await collection.findOne({ id: id });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

// Ajouter un nouveau cadeau
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gift = await collection.insertOne(req.body);

        res.status(201).json(gift.ops[0]);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
