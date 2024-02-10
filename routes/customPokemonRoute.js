import express from "express";
import CustomPokemon from "../models/CustomPokemon.js";
import PokemonStatic from "../models/PokemonStatic.js";

const router = express.Router();

//GET all custom pokemons
router.get('/', async (req, res) => {

    try{
        const customPokemons = await CustomPokemon.find()
        .populate('staticPokemonId')
        .select('-__v');
        res.status(200).send(customPokemons);
    }catch(error){
        res.status(500).send('Server error.')
    }
})

//GET single custom pokemon
router.get('/:id', async (req, res) => {
    try {
        const customPokemon = await CustomPokemon.findById(req.params.id)
        .populate('staticPokemonId')
        .select('-__v');
        if (!customPokemon) {
            return res.status(404).send(`Custom Pokemon with ID ${req.params.id} not found.` );
        }
        res.status(200).send(customPokemon);
    } catch (error) {
        res.status(500).send('Server error.');
    }
});

//POST a new custom pokemon
router.post('/', async (req, res) => {
    try {
        const {name, id, staticPokemonId, nickname, level, attacks, image} = req.body;
        const pokemonStatic = await PokemonStatic.findById(staticPokemonId);
        if (!pokemonStatic) {
            return res.status(404).send(`Pokemon static with ID ${staticPokemonId} not found.`);
        }
        const customPokemon = new CustomPokemon({name, id, staticPokemonId, nickname, level, attacks, image});
        await customPokemon.save();
        res.status(201).send(customPokemon)
    }catch (error) {
        res.status(400).send(error.message);
    }
});

// UPDATE single custom pokemon
router.patch('/:id', async (req, res) => {
    if(!req.body || !Object.keys(req.body).length) {
        res.status(400).send('You must enter a body with at least one property')
    }
    try {
        const { nickname, level, attacks } = req.body;
        const updatedFields = {};
        
        if(nickname) {
           updatedFields.nickname = nickname;
        }
        if(level) {
            updatedFields.level = level;
        }
        if (attacks) {
            updatedFields.attacks = attacks;
        }
        
        const updatedCustomPokemon = await CustomPokemon.findByIdAndUpdate(
            req.params.id,
            updatedFields,
            { new: true }
        );

        if (!updatedCustomPokemon) {
            return res.status(404).send(`Custom pokemon with ID ${req.params.id} not found.`)
        }
        res.status(200).send(updatedCustomPokemon);
    }catch(error) {
        res.status(400).send(error.message);
    }
});

// DELETE single custom pokemon
router.delete('/:id', async (req, res) => {
    try {
        const deletedPokemon = await CustomPokemon.findByIdAndDelete(req.params.id);
        if (!deletedPokemon) {
            return res.status(404).send(`Pokemon with ID ${req.params.id} not found.`);
        }
        res.status(200).send(`Custom pokemon with ID ${req.params.id} deleted successfully`);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

export default router;