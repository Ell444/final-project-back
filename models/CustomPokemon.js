import mongoose from "mongoose";

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
        default: ''
    },
    staticPokemonId: {
        type: SchemaTypes.ObjectId,
        ref: "PokemonStatic"
    },
    type: {
        type: [String]
    },
    description: {
        type: String,
        required: true
    },
    level: {
    type: Number,
    default: Math.ceil(Math.random() * 10),
    min: 1,
    max: 100
   },
   attacks: {
    type: [String],
    default: ['Bite', 'Faint attack']
   },
    image: {
        type: String,
        required: true
    }
});

const CustomPokemon = model('CustomPokemon', schema);

export default CustomPokemon;