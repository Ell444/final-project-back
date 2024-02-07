import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    id: {
        type: Number,
        trim: true,
        required: true,
        unique: true,
        index: true
    },
    type: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

schema.static.findById = function(id){
    return this.findOne({id});
};

const PokemonStatic = model('PokemonStatic', schema);

export default PokemonStatic;