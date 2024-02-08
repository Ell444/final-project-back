import express from "express";
import PokemonStatic from "../models/PokemonStatic.js";

const router = express.Router();

//GET all pokemons

router.get('/', async (req, res) => {

    try{
        const pokemons = await PokemonStatic.find();
        res.send(pokemons);
    }catch(error){
        res.status(500).send('Server error.')
    }
})

//GET single pokemon

router.get ('/:id', async (req, res) => {
    try {
        const pokemon = await PokemonStatic.findById(req.params.id);
        res.send(pokemon);
    }catch(error){
        res.status(404).send(`Pokemon with ID ${req.params.id} not found.`)
    }
})


export default router;