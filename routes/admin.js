const { id, password } = require("../config.json");
const Auth = require("../services/Auth");
const { insertIntoUsers } = require("../services/Database.js");

const express = require("express");
const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: admin
 *  description: admin routes
 */

/**
 * @swagger
 * /admin/test:
 *  get:
 *      summary: route to test if admin route is working
 *      tags: [admin]
 *      responses:
 *          200:
 *              description: admin route is working
 */

router.get("/test", (req, res) => {
  res.json({ message: "OK" });
});

router.post("/login", async (req, res) => {
  try {
    let { uid, pass } = req.body;
    let resMessage = "";
    let generatedJwt = "";
    let status = "fail";
    let resStatus = 200;
    if (id == uid && password == pass) {
      resMessage = "user authorised";
      generatedJwt = await Auth.generateJWT({ id });
      status = "success";
    } else {
      resMessage = "id or password does not match";
      resStatus = 401;
    }

    res
      .status(resStatus)
      .json({ token: generatedJwt, message: resMessage, status: status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add_user", Auth.authenticateToken, async (req, res) => {
  try {
    let { userId, userPass, name, email } = req.body;
    let status = "fail";
    let resMessage = "";
    let ifSuccess = await insertIntoUsers(userId, userPass, name, email);
    console.log(ifSuccess);
    if (ifSuccess) {
      status = "success";
      resMessage = "user added";
      res.status(200).json({ message: resMessage, status: status });
    } else {
      resMessage = "user cannot be added";
      res.status(200).json({ message: resMessage, status: status });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
