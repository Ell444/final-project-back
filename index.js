import dotenv from "dotenv"; dotenv.config();
import cors from "cors";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
const { MONGO_URI } = process.env;
const PORT = process.env.PORT || 3000;
import pokemonStaticRoute from "./routes/pokemonStaticRoute.js";
import customPokemonRoute from "./routes/customPokemonRoute.js";
import authorizationRoute from "./routes/authorizationRoute.js";
import { requireAuth } from "./lib/authorizationHelper.js";

//creating my server
const app = express();

//Generic middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({origin: '*'})); 


//Routes 
app.use('/auth', authorizationRoute);
app.use('/pokemons', pokemonStaticRoute);
app.use(requireAuth());
app.use('/custompokemons', customPokemonRoute);

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