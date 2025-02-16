
const express = require("express");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectToDatabase = require("../models/db");
const router = express.Router();
const dotenv = require("dotenv");
const { body, validationResult } = require('express-validator');
const pino = require("pino"); 
dotenv.config();
const logger = pino(); 
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const existingEmail = await collection.findOne({ email: req.body.email });
    if (existingEmail) {
      logger.error("L'identifiant email existe déjà");
      return res.status(400).json({ error: "L'identifiant email existe déjà" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(req.body.password, salt);
    const email = req.body.email;
    console.log("l'email est", email);
    const newUser = await collection.insertOne({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hash,
      createdAt: new Date(),
    });
    const payload = {
      user: {
        id: newUser.insertedId,
      },
    };
    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info("Utilisateur enregistré avec succès");
    res.json({ authtoken, email });
  } catch (e) {
    logger.error(e);
    return res.status(500).send("Erreur interne du serveur");
  }
});

router.post("/login", async (req, res) => {
  console.log("\n\n Dans la connexion");
  try {
    // const collection = await connectToDatabase();
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const theUser = await collection.findOne({ email: req.body.email });
    if (theUser) {
      let result = await bcryptjs.compare(req.body.password, theUser.password);
      if (!result) {
        logger.error("Les mots de passe ne correspondent pas");
        return res.status(404).json({ error: "Mauvais mot de passe" });
      }
      let payload = {
        user: {
          id: theUser._id.toString(),
        },
      };
      const userName = theUser.firstName;
      const userEmail = theUser.email;
      const authtoken = jwt.sign(payload, JWT_SECRET);
      logger.info("Utilisateur connecté avec succès");
      return res.status(200).json({ authtoken, userName, userEmail });
    } else {
      logger.error("Utilisateur non trouvé");
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
  } catch (e) {
    logger.error(e);
    return res
      .status(500)
      .json({ error: "Erreur interne du serveur", details: e.message });
  }
});

router.put("/update", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(
      "Erreurs de validation dans la requête de mise à jour",
      errors.array()
    );
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const email = req.headers.email;
    if (!email) {
      logger.error("Email non trouvé dans les en-têtes de la requête");
      return res
        .status(400)
        .json({ error: "Email non trouvé dans les en-têtes de la requête" });
    }
    const db = await connectToDatabase();
    const collection = db.collection("users");
    const existingUser = await collection.findOne({ email });
    if (!existingUser) {
      logger.error("Utilisateur non trouvé");
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    existingUser.firstName = req.body.name;
    existingUser.updatedAt = new Date();
    const updatedUser = await collection.findOneAndUpdate(
      { email },
      { $set: existingUser },
      { returnDocument: "after" }
    );
    const payload = {
      user: {
        id: updatedUser._id.toString(),
      },
    };
    const authtoken = jwt.sign(payload, JWT_SECRET);
    logger.info("Utilisateur mis à jour avec succès");
    res.json({ authtoken });
  } catch (error) {
    logger.error(error);
    return res.status(500).send("Erreur interne du serveur");
  }
});

module.exports = router;