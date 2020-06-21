const express = require('express');
const router = express.Router();
const {auth} = require('./verifyToken')


router.post('/', auth, (req, res, next) => {
  res.json({message: "Hey"})
})

module.exports = router