const vol = async (req, res, next) => {
  let {volume} = req

  if( volume > 24000 ) {
    volume = volume / 30
  }
  else if( volume > 16000 ) {
    volume = volume / 20
  }
  else if( volume > 8000 ) {
    volume = volume / 10
  }
  else if ( volume > 1000 ) {
    volume = volume / 10
  }
  else if ( volume > 600 ) {
    volume = volume / 5
  }
  
  req.volume = volume
  next()
}

module.exports.vol = vol;