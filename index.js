import dotenv from "dotenv"; dotenv.config();
import cors from "cors";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
const { MONGO_URI } = process.env;
const PORT = process.env.PORT || 3000;
import pokemonStaticRoute from "./routes/pokemonStaticRoute.js";
import CustomPokemonRoute from "./routes/customPokemonRoute.js";

//creating my server
const app = express();

//Generic middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors()) // imported but to use later in the project


//Routes 
app.use('/pokemons', pokemonStaticRoute);
app.use('/custompokemons', CustomPokemonRoute);

//Database and server run
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
        app.listen(PORT, ()=> {
            console.log(`Server listening on port ${PORT}.`);
        });
    })
    .catch(error => console.error(error));

export default app;