import express from "express";
import PokemonEncounter from "../models/pokemonEncounterSchema.js";
import CustomPokemon from "../models/CustomPokemon.js";
import PokemonStatic from "../models/PokemonStatic.js";

const router = express.Router();

//GET Pokemon Statico randomico

router.get('/random', async (req, res) => {
    try {
        const count = await PokemonStatic.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomPokemon = await PokemonStatic.findOne().skip(randomIndex);
        const encounter = new PokemonEncounter({
            PokemonStaticId: randomPokemon._id
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

router.post('/capture', async (req, res) => {
    
    try{
        const encounterId = req.body.encounterId;
        const encounter = await PokemonEncounter
            .findById(encounterId)
            .populate('PokemonStaticId')
        if(!encounter) {
            return res.status(404).send('You did not encounter any pokemon.')
        }
        const customPokemon = new CustomPokemon({
            name: encounter.PokemonStaticId.name,
            id: encounter.PokemonStaticId.id,
            staticPokemonId: encounter.PokemonStaticId._id,
            level: 5, 
            attacks: encounter.PokemonStaticId.attacks,
            image: encounter.PokemonStaticId.image
        });
        await customPokemon.save();
        await PokemonEncounter.findByIdAndDelete(encounterId);
        res.status(201).send(customPokemon);
    }catch(error) {
        console.error(error);
        res.status(500).send('Server Error.')
    }
});

router.patch('/runaway', async (req, res) => {

    try{
        const encounterId = req.body.encounterId;
        const encounter = await PokemonEncounter.findById(encounterId);
        if(!encounter) {
            return res.status(404).send('You did not encounter any pokemon.')
        }
        await PokemonEncounter.findByIdAndUpdate(encounterId, { resolved: 'Escaped'})
        res.status(200).send('Escaped successfully');
    }catch (error) {
        console.error(error);
        res.status(500).send('Server Error.')
    }
})

export default router;