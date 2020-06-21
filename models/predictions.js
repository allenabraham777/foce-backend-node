const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  food: {
    type: String,
    required: true,
    default: 'Food'
  },
  calorie: {
    type: String,
    required: true,
    default: '0'
  },
  foodmass: {
    type: String,
    required: true,
    default: '0'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Prediction = mongoose.model('Prediction', PredictionSchema);

module.exports = Prediction;