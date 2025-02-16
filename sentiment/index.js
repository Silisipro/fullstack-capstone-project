
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const logger = require('./logger');
const expressPino = require('express-pino-logger')({ logger });
const natural = require("natural");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(expressPino);

app.post('/sentiment', async (req, res) => {
    const { sentence } = req.query;

    if (!sentence) {
        logger.error('Aucune phrase fournie');
        return res.status(400).json({ error: 'Aucune phrase fournie' });
    }

    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutre";

        if (analysisResult < 0) {
            sentiment = "négatif";
        } else if (analysisResult > 0.33) {
            sentiment = "positif";
        }

        logger.info(`Résultat de l'analyse de sentiment : ${analysisResult}`);
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error(`Erreur lors de l'analyse de sentiment : ${error}`);
        res.status(500).json({ message: 'Erreur lors de l\'analyse de sentiment' });
    }
});

app.listen(port, () => {
    logger.info(`Serveur en cours d'exécution sur le port ${port}`);
});