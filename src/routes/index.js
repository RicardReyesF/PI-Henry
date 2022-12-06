const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Recipe } = require('../db')


const router = Router();
router.get('/recipes',async (req,res) => {
    const { name } = req.query;
    
        const recipe = await Recipe.findAll({
            where: {
                name: name,
            }
        });
        return (recipe.length > 0  ? res.json(recipe) : res.send ("No existe la receta, intente otro nombre"))   
        
    
});

router.get('/recipes/:id', async (req,res) => {

        const idRecipe = await Recipe.findByPk(req.params.id);
        return (idRecipe ? res.json(idRecipe) : res.send("no existe el id proporcionado"))
    
});

router.post('/recipes', async(req,res) => {
    const { name, resumen } = req.body;
    
        if(! name || !resumen ) return (res.json({ error: "Faltan datos"}));
        const newRecipes = await Recipe.create(req.body);
        return res.json(newRecipes);


})
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
