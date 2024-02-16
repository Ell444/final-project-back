import mongoose from "mongoose";
import PokemonStatic from "./PokemonStatic.js";

const {Schema, SchemaTypes, model} = mongoose;

const schema = new Schema({
    name: {
        type: String,
       required: true,  
    },
    id: {
        type: Number,
        required: true
    },
    nickname: {
        type: String,
    },
    staticPokemonId: {
        type: SchemaTypes.ObjectId,
        ref: "PokemonStatic"
    },
   level: {
    type: Number,
    required: true,
    default: 5,
    min: 2,
    max: 100
   },
   attacks: {
    type: [String],
    required: true,
    /* validate: {
        validator: (val) => {
            return val.length === 2;
        },
        message: props => `${props.value} there has to be at least two attacks.`
    } */
   },
    image: {
        type: String,
        required: true
    }
});

const CustomPokemon = model('CustomPokemon', schema);

export default CustomPokemon;