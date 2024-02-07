import express from "express";
import PersonalPokemon from "../models/PersonalPokemon.js";

const router = express.Router();

//GET all pokemons
router.get('/', async (req, res) => {

    try{
        const customPokemons = await PersonalPokemon.find();
        res.send(customPokemons);
    }catch(error){
        res.status(500).send('Server error.')
    }
})

//GET single pokemon
router.get ('/:id', async (req, res) => {
    try {
        const customPokemon = await PersonalPokemon.findById(req.params.id);
        res.send(customPokemon);
    }catch(error){
        res.status(404).send(`Pokemon with ID ${_id} not found.`)
    }
})

//CREATE a custom pokemon
router.post('/', async (req, res) => {
    try {
        const customPokemon = new PersonalPokemon(req.body);
        await customPokemon.save();
        res.send(customPokemon);
    }catch(error){
        res.status(400).send(error.message);
    }
});

//UPDATE single pokemon

//DELETE single pokemon
router.delete('/:id', async (req, res) => {
    try {
        await PersonalPokemon.findOneAndDelete(req.params.id);
        res.send(`Pokemon with ID ${req.params.id} deleted successfully`);
    }catch(error){
        res.status(404).send(error.message);
    }
})
export default router;