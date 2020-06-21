const axios = require('axios');
const FormData = require('form-data');

const volume = async (req, res, next) => {
  // req.volume = 729.32
  // return next()

  var formData = new FormData();
  
  formData.append('file', req.file.buffer, {
    filepath: 'food.jpg',
    contentType: 'image/jpg',
  });
  
  return await axios.post(
    process.env.VOLUME_BACKEND,
    formData,
    {
      timeout: 300000,
      headers:  formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    }
  ).then((response)=>{
    // console.log("Success 1");
    const volume = response.data.food;
    req.volume = parseFloat(volume);
    next()
  }).catch((err)=>{
    console.log(err.message);
    return res.status(400).json({error: "Error"});
  })
}

module.exports.volume = volume;