const mongoose = require("mongoose");
const utilisateurSchema = mongoose.Schema({
    nom:String,
    email:String,
    mot_passe:String,
    created_at:{
        type:Date,
        default:Date.now(),
    },
});
module.exports = utilisateur = mongoose.model("utilisateur",utilisateurSchema);