const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Recipe, Diets } = require('../db')

const axios = require('axios');

const router = Router();



router.get('/getAllrecipe', async (req,res) => {
    try {
        let newRecipes = [];
        const {data}  = await axios.get(`https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5`);
        data.results.map( recipes => {
            newRecipes.push ({
                //id:         recipes.id,
                name:       recipes.title,
                resumen:    recipes.summary,
                score:      recipes.healthScore,
                //stepByStep: recipes.analyzedInstructions.steps,
                img:        recipes.image,
                typeDish:   recipes.dishTypes[0],
                diet:       recipes.diets[0]       
                
            })
        })
        await Recipe.bulkCreate(newRecipes);
        return res.json(newRecipes);
    } catch (error) {
        res.send(error.message)
    }
})



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

        const idRecipe = await Recipe.findAll({
            where:{
                id: req.params.id
            },
            //attributes: ['resumen'],
            include: Diets
        });
        return (idRecipe ? res.json(idRecipe) : res.send("no existe el id proporcionado"))

});


router.post('/recipes', async(req,res) => {
    const { id, name, resumen, score, stepByStep, dietId } = req.body;
    try {
        if(! name || !resumen ) return (res.json({ error: "Faltan datos"}));
        const newRecipes = await Recipe.create({
            name: name,
            resumen: resumen,
            score: score,
            stepByStep: stepByStep
        });
        const dietName = await Diets.findByPk(dietId);
        await newRecipes.addDiets(dietName)
        res.json(newRecipes)
        
    } catch (err) {
        res.json({
            error: "Se repitio el nombre"
        })
    }
})

router.get('/diets', async (req,res) => {
    
    const { diets } = req.body;
    const allDiets = await Diets.findAll();
    if (allDiets.length > 0){
        return res.json(allDiets);  
    } else {
        const createDiet = await Diets.bulkCreate(diets);
        return res.json(createDiet);

    }
});

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
