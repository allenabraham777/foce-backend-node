const mongoose = require('mongoose');

const CalorieSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
    default: 'Food'
  },
  serve: {
    type: String,
    required: true,
    default: '0'
  },
  calories: {
    type: String,
    required: true,
    default: '0'
  },
  density: {
    type: String,
    required: true,
    default: '0'
  }
});

const Calorie = mongoose.model('Calorie', CalorieSchema);

module.exports = Calorie;