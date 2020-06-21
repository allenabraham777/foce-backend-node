var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('welcome')
});

router.get('/login', function(req, res) {
  res.render('login')
});

router.get('/register', function(req, res) {
  res.render('register')
});
router.get('/uploader', function(req, res) {
  res.render('uploader')
});

module.exports = router;
