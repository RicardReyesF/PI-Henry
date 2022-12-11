const { Router } = require('express');
const axios = require('axios');
const fetch = require('fetch');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const{ API_KEY }  = process.env
const router = Router();

router.get('/recipe', async (req,res) => {
    try {
        const {data}  = await fetch(`https://api.spoonacular.com/recipes/complexSearch&apiKey=${API_KEY}&addRecipeInformation=true&number=100`);
        res.send(data.results);
    } catch (error) {
        res.send(error.message)
    }
})


module.exports = router