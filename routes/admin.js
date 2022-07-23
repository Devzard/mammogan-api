const { id, password, applications } = require("../config.json");
const Auth = require("../services/Auth");
const DB = require("../services/Database.js");

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

router.get("/get_users", Auth.authenticateToken, async (req, res) => {
  try {
    let status = "fail";
    let resMessage = "";
    let users = await DB.getAllUsers();
    if (users && users.length >= 0) status = "success";
    res.status(200).json({ data: users, message: resMessage, status: status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/get_users/:id", Auth.authenticateToken, async (req, res) => {
  let id = req.params.id;
  try {
    let status = "fail";
    let resMessage = "";
    let user = await DB.getUser(id);
    res.status(200).json({ data: user, message: resMessage, status: status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/add_user", Auth.authenticateToken, async (req, res) => {
  try {
    let { userId, userPass, name, email } = req.body;
    let status = "fail";
    let resMessage = "";
    let ifSuccess = await DB.insertIntoUsers(userId, userPass, name, email);
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

router.post("/edit_user", Auth.authenticateToken, async (req, res) => {
  try {
    let { userId, userPass, name, email } = req.body;
    let status = "fail";
    let resMessage = "";
    let ifSuccess = await DB.editUser(userId, userPass, name, email);
    if (ifSuccess) {
      status = "success";
      resMessage = "user modified";
      res.status(200).json({ message: resMessage, status: status });
    } else {
      resMessage = "user cannot be modified";
      res.status(200).json({ message: resMessage, status: status });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/get_applications", Auth.authenticateToken, async (req, res) => {
  try {
    let {userId} = req.body;
    let status = "fail";
    let resMessage = "application data fetched successfully";
    let resData = await DB.getUserAllowedApplications(userId);
    res
      .status(200)
      .json({ message: resMessage, status: status, data: resData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
