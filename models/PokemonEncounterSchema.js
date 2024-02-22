import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const schema = new Schema({
    PokemonStaticId: {
        type: SchemaTypes.ObjectId,
        ref: 'PokemonStatic',
        required: true
    }, 
   resolved: {
    type: String,
    enum: ['capture', 'runaway'],
    default: null
   }
}, { timestamps: true });

const PokemonEncounter = model('PokemonEncounter', schema);

export default PokemonEncounter;