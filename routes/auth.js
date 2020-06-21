const express = require('express');
const bcrypt = require('bcryptjs');
const {auth} = require('./verifyToken');
const jwt = require('jsonwebtoken')
const router = express.Router();

const User = require('../models/user');
const {registerValidation,loginValidation} = require('../validation')

router.get('/', auth, (req,res,next) => {
  try {
    // console.log(req.user);
    // return res.status(200).json({user:{
    //   name: "Allen",
    //   email: "Oru Email"
    // }})

    User.findById(req.user)
    .then((response) => {
      // console.log(response);
      return res.status(200).json({user:{
        name: response.name,
        email: response.email
      }})
    })
    .catch((err) => {
      res.status(401).json({message: 'Unauthorized'});
    })
  }
  catch (err) {
    res.status(401).json({message: 'Unauthorized'});
  }
});

router.post('/register', async (req, res, next) => {

  const {name,email,password,password2} = req.body
  //Validate
  const {error} = registerValidation(req.body)
  
  if(error)
  {
    // console.log(error.details[0].message);
    return res.status(422).json({message: error.details[0].message})
  }
  else {
    const emailExists = await User.findOne({email})
    if(!emailExists) {
      if(password === password2) {
        //Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({
          name,
          email,
          password: hashedPassword      
        });
        try {
          const savedUser = await user.save()
          res.status(201).json({message: "User Successfully Created"})
        } catch (err) {
          res.status(500).send({message: err.message})
        }
      }
      else {
        res.status(422).json({message: "Password Mismatch"})
      }
    }
    else {
      res.status(409).json({message: "Account already exists"})
    }
  }
});

router.post('/login', async (req, res, next) => {
  const {email,password} = req.body

  const {error} = loginValidation(req.body)

  if(error)
  {
    // console.log(error.details[0].message);
    return res.status(422).json({message: error.details[0].message})
  }
  else {
    const user = await User.findOne({email})
    if(user) {
      const validPass = await bcrypt.compare(password, user.password)
      // console.log(validPass);
      if(validPass){

        // Assigning a Token
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)

        // console.log(token);

        res.status(200).header('Authorization', `Bearer ${token}`).json({
          access_token: token
        })
      }
      else {
        res.status(401).json({message: "Check your username or password"})
      }
    }
    else {
      res.status(401).json({message: "Check your username or password"})
    }
  }
})

router.get('/logout', async(req, res, next) => {
  res.status(200).json({message: "Logged Out"});
})

module.exports = router;
