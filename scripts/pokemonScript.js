import dotenv from "dotenv";
import fs from "fs";
import PokemonStatic from "../models/PokemonStatic.js";
import mongoose from "mongoose";
const { MONGO_URI } = process.env;

const run = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');

        // Read JSON file
        fs.readFile('pokedex.json', 'utf8', async (err, data) => {
            if (err) {
                console.error('Could not read the file:', err);
                return;
            }

            const pokedex = JSON.parse(data); 
            
            // Take only the first generation from the array
            const firstGenPokemon = pokedex.slice(0, 150);

            // Map Pokemon data
            const pokemonData = firstGenPokemon.map(pokemon => ({
                name: pokemon.name.english,
                id: pokemon.id,
                type: pokemon.type,
                description: pokemon.description,
                image: pokemon.image.hires
            }));

            // Save pokemon to database
            for (const p of pokemonData) {
                const exists = await PokemonStatic.findOne({ id: p.id });
                if (!exists) {
                    await PokemonStatic.create(p);
                    console.log(`${p.name.english} created successfully.`);
                } else {
                    console.log(`${p.name.english} already exists.`);
                }
            }
        });
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    }
}

run();