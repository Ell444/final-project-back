import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
    },
   owner: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
   },
   level: {
    type: Number,
    required: true,
    default: 5,
   },
   attacks: {
    type: [String],
    required: true,
    validate: {
        validator: (val) => {
            return val.length === 2;
        },
        message: props => `${props.value} there has to be at least two attacks.`
    }
   },
    image: {
        type: String,
        required: true
    }
});

const PersonalPokemon = model('PersonalPokemon', schema);

export default PersonalPokemon;