const jwt = require('jsonwebtoken');
const Users = require('../models/user');

const auth = async (req, res, next) => {
  //   console.log('MiddleWare working');
  //   next();
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await Users.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send('Invalid Authentication');
  }
};

module.exports = auth;
