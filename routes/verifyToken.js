const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    const token = await req.header('auth-token');
    // console.log(req.header('auth-token'))
    // console.log(req.header('Authorization'))
    if (!token) {
      return res.status(401).json({ error: "Access Denied" });
    }
    const decoded = jwt.decode(token, process.env.TOKEN_SECRET);
    req.user = decoded;
    next();
  }
  catch (err) {
    res.status(401).json({ error: "Accecss Denied" });
  }
}

module.exports.auth = auth;