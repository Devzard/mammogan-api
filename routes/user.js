const { applications } = require("../config.json");
const Auth = require("../services/Auth");
const DB = require("../services/Database.js");

const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    let { uid, pass } = req.body;
    let resMessage = "";
    let generatedJwt = "";
    let status = "fail";
    let resStatus = 200;
    let dbRes = await DB.checkIfExistsUser(uid);
    if (dbRes && dbRes.length && dbRes[0].password == pass) {
      resMessage = "user authorised";
      generatedJwt = await Auth.generateJWT({ uid });
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

router.post("/update_time", Auth.authenticateUserToken, async (req, res) => {
  try {
    let { uid, addTime } = req.body;
    let resMessage = "";
    let status = "fail";
    let resStatus = 200;
    let dbRes = await DB.updateLastActive(uid, addTime);
    if (dbRes) {
      resMessage = "successfully updated";
      status = "success";
    }
    res.status(resStatus).json({ message: resMessage, status: status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/update_count", Auth.authenticateToken, async (req, res) => {
  try {
    let availabeCounts = ["image_count", "image_saved_count"];

    let { uid, colName } = req.body;
    let resMessage = "";
    let status = "fail";
    let resStatus = 200;
    let dbRes = null;

    if (availabeCounts.indexOf(colName) !== -1) {
      dbRes = await DB.updateCount(uid, colName);
      if (dbRes) {
        resMessage = "successfully updated";
        status = "success";
      }
    } else {
      resStatus = 401;
      resMessage = "column name does not match";
    }
    res.status(resStatus).json({ message: resMessage, status: status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
