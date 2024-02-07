import dotenv from "dotenv"; dotenv.config();
import fs from "fs";
import PokemonStatic from "../models/PokemonStatic.js";
import mongoose from "mongoose";
const { MONGO_URI } = process.env;

const run = async () => {

    try{

        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');
    
         //Read file JSON
         const rawData = await fs.promises.readFile('pokedex.json', 'utf8');
         const pokedex = JSON.parse(rawData);
         
        //Take only the first generation from the array
            const firstGenPokemon = pokedex.slice(0, 150);
        
            const pokemonData = firstGenPokemon.map(pokemon => ({
                name: pokemon.name.english,
                id: pokemon.id,
                type: pokemon.type,
                description: pokemon.description,
                image: pokemon.image.hires
            }
        ));

        //Save pokemon to database
        for (const pokemon of pokemonData) {
            try {
                await PokemonStatic.create(pokemon)
                console.log(`Pokemon "${pokemon.name}" saved to database with successfully`)
            } catch (error) {
                console.error(`Error saving Pokemon "${pokemon.name}" to database`, error);
            }
        };

    }catch(error){

        console.error(error);
    }
}

run();