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
                stepByStep: recipes.analyzedInstructions.map( result => result.steps.map( s => {
                    return {
                        numberStep: s.number,
                        step: s.step
                    }
                })),
                img:        recipes.image,
                typeDish:   recipes.dishTypes.map( type => type),
                diet:       recipes.diets.map(diet => diet),    
        }
    })

    return infoApi;
} 

const getInfoDb = async () => {
    const db = await Recipe.findAll({
        attributes:["id","name","resumen","score","stepByStep"],
        include: Diets,
    })
    return db;
}

const getAllRecipes = async () => {
    const infoApi = await getInfoApi();
    const infoDb  = await getInfoDb();
    const newRecipes = infoApi.concat(infoDb);
    
    return newRecipes;
}

router.get('/recipes', async (req,res) => {
    const { query } = req.query;
    const recipes = await getAllRecipes();
    
    if(!query){
        res.status(200).json(recipes);
        //res.status(400).send("No existe ninguna receta")
    }else {
        const queryRecipes = await recipes.filter(recipe => {
            return recipe.name.includes(query)
        })
        res.status(200).json(queryRecipes);
        //res.status(404).send("No existe ninguna receta con ese nombre")
    }
})

router.get('/recipes/:id', async (req,res) => {
    const  {id}  = req.params;
    //console.log(id.type())
    const recipes = await getAllRecipes();
    
    const idRecipes = await recipes.filter(recipe => {
        return recipe.id == id;
    })
    res.status(200).json(idRecipes);
    //res.status(404).send("No existe una receta con ese ID");
});


router.post('/recipes', async(req,res) => {
    const { name, resumen, score, stepByStep, dietId } = req.body;
    
        if(! name || !resumen ) {
            return (res.send( "Faltan datos"));
        }
        let newRecipes = await Recipe.create({
            name: name,
            resumen: resumen,
            score: score,
            stepByStep: stepByStep,
            
        });
        
            let dietName = await Diets.findAll({
                where: {
                    id: dietId
                }
            });    
            newRecipes.addDiets(dietName)
        
        
        //res.json(newRecipes);
        res.send("Se creo la receta correctamente")
        
})

router.get('/diets', async (req,res) => {
    
    const diets = [
        {        
        "name": "Gluten Free"
        },
        {
          "name": "Ketogenic"
        },{
          "name": "Vegetarian"
        },{
          "name": "Lacto-Vegetarian"
        },{
          "name": "Ovo-Vegetarian"
        },{
          "name": "Vegan"
        },{
          "name": "Pescetarian"
        },{
          "name": "Paleo"
        },{
          "name": "Low FODMAP"
        },{
          "name": "Whole30"
        }]
    
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
