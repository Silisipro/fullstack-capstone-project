// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const logger = require('./logger');
// const expressPino = require('express-pino-logger')({ logger });
// // Task 1: import the natural library
// const natural = {{insert code here}}

// // Task 2: initialize the express server
// {{insert code here}}
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(expressPino);

// // Define the sentiment analysis route
// // Task 3: create the POST /sentiment analysis
// app.{{insert method here}}('{{insert route here}}', async (req, res) => {

//     // Task 4: extract the sentence parameter
//     const { sentence } = {{insert code here}};


//     if (!sentence) {
//         logger.error('No sentence provided');
//         return res.status(400).json({ error: 'No sentence provided' });
//     }

//     // Initialize the sentiment analyzer with the Natural's PorterStemmer and "English" language
//     const Analyzer = natural.SentimentAnalyzer;
//     const stemmer = natural.PorterStemmer;
//     const analyzer = new Analyzer("English", stemmer, "afinn");

//     // Perform sentiment analysis
//     try {
//         const analysisResult = analyzer.getSentiment(sentence.split(' '));

//         let sentiment = "neutral";

//         // Task 5: set sentiment to negative or positive based on score rules
//         {{insert code here}}

//         // Logging the result
//         logger.info(`Sentiment analysis result: ${analysisResult}`);

//         // Task 6: send a status code of 200 with both sentiment score and the sentiment txt in the format { sentimentScore: analysisResult, sentiment: sentiment }
//         {{insert code here}}
//     } catch (error) {
//         logger.error(`Error performing sentiment analysis: ${error}`);
//         // Task 7: if there is an error, return a HTTP code of 500 and the json {'message': 'Error performing sentiment analysis'}
//         {{insert code here}}
//     }
// });

// app.listen(port, () => {
//     logger.info(`Server running on port ${port}`);
// });


// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const logger = require('./logger');
// const expressPino = require('express-pino-logger')({ logger });

// // Task 1: Importer la bibliothèque Natural
// const natural = require("natural");

// // Task 2: Initialiser le serveur Express
// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use(expressPino);

// // Définir la route d'analyse de sentiment
// // Task 3: Créer l'endpoint POST /sentiment
// app.post('/sentiment', async (req, res) => {

//     // Task 4: Extraire le paramètre sentence
//     const { sentence } = req.body;

//     if (!sentence) {
//         logger.error('No sentence provided');
//         return res.status(400).json({ error: 'No sentence provided' });
//     }

//     // Initialiser l'analyseur de sentiment avec le PorterStemmer et la langue anglaise
//     const Analyzer = natural.SentimentAnalyzer;
//     const stemmer = natural.PorterStemmer;
//     const analyzer = new Analyzer("English", stemmer, "afinn");

//     // Effectuer l'analyse de sentiment
//     try {
//         const analysisResult = analyzer.getSentiment(sentence.split(' '));

//         let sentiment = "neutral";

//         // Task 5: Déterminer le sentiment en fonction du score
//         if (analysisResult < 0) {
//             sentiment = "negative";
//         } else if (analysisResult >= 0.33) {
//             sentiment = "positive";
//         }

//         // Logger le résultat
//         logger.info(`Sentiment analysis result: ${analysisResult}`);

//         // Task 6: Envoyer la réponse avec le statut 200
//         res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });

//     } catch (error) {
//         logger.error(`Error performing sentiment analysis: ${error}`);
        
//         // Task 7: Retourner une erreur 500 avec un message JSON
//         res.status(500).json({ message: 'Error performing sentiment analysis' });
//     }
// });

// app.listen(port, () => {
//     logger.info(`Server running on port ${port}`);
// });


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

// Définir la route d'analyse de sentiment
app.post('/sentiment', async (req, res) => {
    const { sentence } = req.query;

    if (!sentence) {
        logger.error('Aucune phrase fournie');
        return res.status(400).json({ error: 'Aucune phrase fournie' });
    }

    // Initialiser l'analyseur de sentiment avec le PorterStemmer de Natural et la langue "Anglais"
    const Analyzer = natural.SentimentAnalyzer;
    const stemmer = natural.PorterStemmer;
    const analyzer = new Analyzer("English", stemmer, "afinn");

    // Effectuer l'analyse de sentiment
    try {
        const analysisResult = analyzer.getSentiment(sentence.split(' '));

        let sentiment = "neutre";

        if (analysisResult < 0) {
            sentiment = "négatif";
        } else if (analysisResult > 0.33) {
            sentiment = "positif";
        }

        // Journaliser le résultat
        logger.info(`Résultat de l'analyse de sentiment : ${analysisResult}`);
        // Répondre avec le résultat de l'analyse de sentiment
        res.status(200).json({ sentimentScore: analysisResult, sentiment: sentiment });
    } catch (error) {
        logger.error(`Erreur lors de l'analyse de sentiment : ${error}`);
        res.status(500).json({ message: 'Erreur lors de l\'analyse de sentiment' });
    }
});

// Démarrer le serveur
app.listen(port, () => {
    logger.info(`Serveur en cours d'exécution sur le port ${port}`);
});