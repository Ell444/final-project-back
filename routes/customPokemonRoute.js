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
        const {staticPokemonId, nickname, level, attacks} = req.body;
        const pokemonStatic = await PokemonStatic.findById(staticPokemonId);
        if (!pokemonStatic) {
            return res.status(404).send(`Pokemon static with ID ${staticPokemonId} not found.`);
        }
        const customPokemon = new CustomPokemon({staticPokemonId, nickname, level, attacks});
        await customPokemon.save();
        res.status(201).send(customPokemon)
    }catch (error) {
        res.status(400).send(error.message);
    }
});

// UPDATE single custom pokemon
router.put('/:id', async (req, res) => {
    try {
        const {nickname, attacks, level} = req.body;
        const updatedCustomPokemon = await CustomPokemon.findByIdAndUpdate(
           /*  req.params.id, */
            { nickname, attacks, level },
            { new: true }
        );
        if(!updatedCustomPokemon) {
            return res.status(404).send(`Custom pokemon with ID ${req.params.id} not found.`)
        }
        res.status(200).send(updatedCustomPokemon);
    }catch (error) {
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