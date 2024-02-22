import express from "express";
import PokemonEncounter from "../models/PokemonEncounterSchema.js";
import CustomPokemon from "../models/CustomPokemon.js";
import PokemonStatic from "../models/PokemonStatic.js";
import User from "../models/User.js";

const router = express.Router();

//GET Pokemon Statico randomico

router.get('/random', async (req, res) => {
    try {
        const count = await PokemonStatic.countDocuments(); //conto tutti i sp che ho nel database
        const randomIndex = Math.floor(Math.random() * count); //faccio un math.random 
        const randomPokemon = await PokemonStatic.findOne().skip(randomIndex); 
        const encounter = new PokemonEncounter({
            PokemonStaticId: randomPokemon._id //assegno l'id del pokemon statico al pokemon randomico
        });
        await encounter.save();
        res.status(200).send({ 
            encounterId: encounter._id,
            pokemon: randomPokemon
        });
    }catch(error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

//POST per catturare pokemon e salvarlo dentro lo user
router.post('/capture/:userId', async (req, res) => {
    
    try{
       const { userId } = req.params;
       const user = await User.findOne({_id: userId});
       if(!user) {
        throw new Error ('User not found');
       };
       if(!req.body) {
        throw new Error ('You must send a valid body!');
       }
       const { name, id, image, _id, type, description } = req.body;
       const cp = await CustomPokemon.create({
        name,
        id,
        image,
        type,
        description,
        staticPokemonId: _id,
        
       })
       user.team.push(cp._id); //faccio un push dell'id del cp nel team dello usero
       await user.save(); //salvo lo user col suo team
       const userResponse = await User.findById(userId)
       .populate('team', 'name level attacks nickname type description'); //popolo la proprieta team dello user col cp
       res.send(userResponse);
    }catch(error) {
        console.error(error);
        res.status(500).send(error.message)
    }
}); 

export default router;