const express = require('express');
const router = express.Router();
const {auth} = require('./verifyToken');
const {volume} = require('./getVolume');
const {food} = require('./getFood')
const Calorie = require('../models/calories')
const Prediction = require('../models/predictions')

async function findFood(formData) {
}

router.post('/', auth, volume, food, async (req, res, next) => {
  // return res.status(200).json({
  //   food: req.food,
  //   calorie: "300 Cal",
  //   volume: '1200 cc'
  // });

  console.table({
    'Predicted   Food': req.food,
    'Estimated Volume': req.volume
  })

  let {food,volume,user} = req;
  let foodmass;
  const calorieDetails = await Calorie.findOne({food});
  food = food.replace("_"," ");
  let calorie;
  if(calorieDetails != null) {
    let {density,calories,serve} = calorieDetails
    density = parseFloat(density)
    calories = parseFloat(calories)
    calories = calories
    serve = parseFloat(serve)
    volume = parseFloat(volume)
    foodmass = density * volume
    calorie = (foodmass * calories) / serve
    calorie = calorie.toFixed(2)
    calorie = `${calorie} Cal`
    foodmass = foodmass.toFixed(2)
    foodmass = `${foodmass} g`
    const prediction = new Prediction({
      food,
      calorie,
      foodmass,
      user      
    });
    try {
      const savedPrediction = await prediction.save()
      console.log(savedPrediction);
    } catch (err) {
      console.log(err.message)
    }
    // console.log(`${density} - ${calories} - ${serve} - ${volume} - ${foodmass} - ${calorie}`)
  } 
  else {
    calorie = "Sorry calorie data unavailable"
  }
  const foodDetails = {
    food,
    calorie,
    foodmass
  };
  return res.status(200).json(foodDetails);
  // return res.status(200).json({foodName, foodVolume});
})

router.get('/results', auth, async (req, res, next) => {
  await Prediction.find({user: req.user})
  .then((calorieDetails) => {
    res.status(200).json({history: calorieDetails})
  })
  .catch((err) => {
    res.status(200).json({history: null})
  })
  // res.render('results');
})

router.post('/results', (req, res, next) => {
})

module.exports = router
