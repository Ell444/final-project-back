import mongoose from "mongoose";
const {Schema, SchemaTypes, model} = mongoose;

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: Number,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});



const User = model('User', schema);

export default User;