const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 5003;
const mongoose = require("mongoose");
const Utilisateur = require("./utilisateur");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

mongoose.connect("mongodb://localhost/auth-service")
    .then(() => {
        console.log("auth-service DB Connected");
    })
    .catch((error) => {
        console.error("Database connection error:", error);
        process.exit(1); 
    });

app.use(express.json());

app.post("/auth/register", async (req, res) => {
    let { nom, email, mot_passe } = req.body;
    const userExists = await Utilisateur.findOne({ email });
    if (userExists) {
        return res.json({ message: "Cet utilisateur existe déjà" });
    } else {
        bcrypt.hash(mot_passe, 10, (error, hash) => {
            if (error) {
                return res.status(500).json({
                    error: error,
                });
            } else {
                mot_passe = hash;
                const newUtilisateur = new Utilisateur({
                    nom,
                    email,
                    mot_passe
                });
                newUtilisateur.save()
                    .then(user => res.status(201).json(user))
                    .catch(error => res.status(400).json({ error }));
            }
        });
    }
});

app.post("/auth/login", async (req, res) => {
    const { email, mot_passe } = req.body;
    const user = await Utilisateur.findOne({ email }); 
    if (!user) {
        return res.json({ message: "Utilisateur introuvable" });
    } else {
        bcrypt.compare(mot_passe, user.mot_passe).then(resultat => {
            if (!resultat) {
                return res.json({ message: "Mot de passe incorrect" });
            } else {
                const payload = {
                    email,
                    nom: user.nom
                };
                jwt.sign(payload, "secret", (err, token) => {
                    if (err) console.log(err);
                    else return res.json({ token: token });
                });
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`auth-Service at ${PORT}`);
});
