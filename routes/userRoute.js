import express from "express";
import User from "../models/User.js";

const router = express.Router();

//rotta GET per lo user che mi serve per avere sempre lo user col suo team
router.get ('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('team', 'name nickname level description attacks type id image staticPokemonId');
        res.send(user);
    }catch(error){
        res.status(404).send(`User with ID ${req.params.id} not found.`)
    }
})

export default router;