const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 5000;
const mongoose = require("mongoose");
const produit=require("./produit");
app.use(express.json());
mongoose.set("strictQuery",true);
mongoose
.connect("mongodb://127.0.0.1/produit-service")
.then(()=>{
    console.log("produit-service DB Connected");
})
.catch((error)=>console.log(error));
app.post("/produit/ajouter",(req,res,next)=>{
    const{nom,description,prix}=req.body;
    const newProduit = new produit({
        nom,
        description,
        prix
    });
    newProduit.save()
    .then(produit=>res.status(201).json(produit))
    .catch(error=>res.status(400).json({error}));
});
app.post("/produit/acheter",(req,res,next)=>{
    const{ids}=req.body;
    produit.find({_id:{$in:ids}})
    .then(produits => res.status(201).json(produits))
    .catch(error => res.status(400).json({error}))
});
app.listen(PORT, () =>{
    console.log(`produit-service at ${PORT}`);
})

