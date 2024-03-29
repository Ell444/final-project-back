import express from "express";
import User from "../models/User.js";
import { generateToken } from "../lib/authorizationHelper.js";

const router = express.Router();
router.use(express.json());

//Rotta per lo SIGNUP
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) { //Controllo sull'utente, se non inserisce i dati neccessari, mando un errore e blocco lo signup
        return res.status(400).send('All field must be filled.')
    }

    try {
        const user = await User.signUp(email, password) //Generazione del Token per l'utente
        const token = generateToken(user._id)
        return res.status(201).send({
            user,
            token
        });
    }catch(error){
        console.error(error)
        const code = error.statusCode || 500;
        res.status(code).send(error.message);
    }
})

//Rotta per il LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).send('All fields must be filled.')
    }

    try{
        const user = await User.logIn(email, password)
        const token = generateToken(user._id)
        return res.status(202).send({
            user,
            token
        });
    }catch(error){
        console.error(error)
        const code = error.statusCode || 500;
        res.status(code).send(error.message);
    }
})

export default router;