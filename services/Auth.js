const jwt = require("jsonwebtoken");

const generateJWT = (tokenData) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        ...tokenData,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

//FORMAT OF TOKEN
//Authorization: Bearer <access_token>

const authenticateToken = (req, res, next) => {
  //v2
  //get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    //get token from array
    const bearerToken = bearer[1];
    //set token
    req.token = bearerToken;
    //next middleware
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      if (err) res.sendStatus(403);
      else {
        req.body.authData = authData;
        next();
      }
    });
  } else {
    console.log("Request Blocked -> IP: ", req.connection.remoteAddress);
    console.log(
      "Request Blocked -> IP: ",
      req.headers["x-forwarded-for"],
      " (if server behind proxy)"
    );
    res.sendStatus(403);
  }
};

const authenticateUserToken = (req, res, next) => {
  //v2
  //get auth header value
  const bearerHeader = req.headers["authorization"];
  // check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    //get token from array
    const bearerToken = bearer[1];
    //set token
    req.token = bearerToken;
    //next middleware
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      if (err) res.sendStatus(403);
      else {
        req.body.authData = authData;
        next();
      }
    });
  } else {
    console.log("Request Blocked -> IP: ", req.connection.remoteAddress);
    console.log(
      "Request Blocked -> IP: ",
      req.headers["x-forwarded-for"],
      " (if server behind proxy)"
    );
    res.sendStatus(403);
  }
};

module.exports = { generateJWT, authenticateToken, authenticateUserToken };
