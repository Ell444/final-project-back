import dotenv from "dotenv"; dotenv.config();
import fs from "fs";
import mongoose from "mongoose";
const { MONGO_URI } = process.env;

const run = async () => {

    try{

        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');
    
         //Read file JSON
         fs.readFile('pokedex.json', 'utf8', (err, data) => {
            if (err) {
                console.error('There was an error while reading the file', err);
                return;
            }
        
        //JSON parsing
            const pokedex = JSON.parse(data);
        
        //Take only the first genration from the array
            const firstGenPokemon = pokedex.slice(0, 150);
        
            const pokemon = pokedex.map(pokemon => ({
                name: pokemon.name.english,
                id: pokemon.id,
                type: pokemon.type,
                description: pokemon.description,
                image: pokemon.image.hires
            }
        ));


    })
    }catch(error){

        console.error(error);

    }
}

run();