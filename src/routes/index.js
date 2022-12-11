const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const { Recipe, Diets } = require('../db')

const axios = require('axios');

const router = Router();


const getInfoApi = async () => {
    const api = await axios.get('https://run.mocky.io/v3/84b3f19c-7642-4552-b69c-c53742badee5');
    const infoApi = api.data.results.map( recipes => {
        return {
                id:         recipes.id,
                name:       recipes.title,
                resumen:    recipes.summary,
                score:      recipes.healthScore,
                // stepByStep: recipes.analyzedInstructions.steps.map( result =>{
                //     return {
                //         stepNumber: result.number,
                //         step:       result.step
                //     }
                // }),
                img:        recipes.image,
                typeDish:   recipes.dishTypes.map( type => type),
                diet:       recipes.diets.map(diet => diet),    
        }
    })
    //console.log(infoApi);
    return infoApi;
} 

const getInfoDb = async () => {
    const db = await Recipe.findAll({
        attributes:["name","resumen","score","stepByStep"],
        include: Diets,
    })
    console.log(db);
    return db;
}

const getAllRecipes = async () => {
    const infoApi = await getInfoApi();
    const infoDb  = await getInfoDb();
    const newRecipes = infoApi.concat(infoDb);
    console.log(newRecipes);
    return newRecipes;
}

router.get('/recipes', async (req,res) => {
    try {
        res.send( getAllRecipes());
    } catch (error) {
        res.send(error.message)
    }
})



router.get('/recipes1',async (req,res) => {
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
            attributes: ['resumen'],
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
