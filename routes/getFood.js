const axios = require('axios');
const FormData = require('form-data');

const food = async (req, res, next) => {
  // req.food = 'Samosa'
  // return next()
  var formData = new FormData();
  
  formData.append('file', req.file.buffer, {
    filepath: 'food.jpg',
    contentType: 'image/jpg',
  });
  
  return await axios.post(process.env.FOOD_BACKEND,
    formData,
    {
      timeout: 300000,
      headers:  formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }
  ).then((response)=>{
    // console.log("Success 2");
    req.food = response.data.result;
    next()
  }).catch((err)=>{
    // console.log(err);
    return res.status(err.response.status).json({message: err.response.statusText});
  })
}

module.exports.food = food;