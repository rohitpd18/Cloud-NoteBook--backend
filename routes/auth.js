const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "rohtQ@$";

// ROUTE 1: create user using POST '/api/auth/createuser', No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let sucess= false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ sucess,errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({sucess, error: "Sorry a user with this email already exists" });
      }

      //   creating a secure pasword
      let salt = await bcrypt.genSalt(10);
      let secPas = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPas,
        email: req.body.email,
      });

      let data = {
        user: {
          id: user.id,
        },
      };
      //   sign in JWT token
      const authToken = jwt.sign(data, JWT_SECRET);

      sucess= true;
      //   send token to data base
      res.json({sucess, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({sucess, massage:"Some Error occured"});
    }
  }
);

//  ROUTE 2: Authentice a user using: POST '/api/auth/login', login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter yout password").exists(),
  ],
  async (req, res) => {
    let sucess= false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({sucess, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // finding does user exist
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({sucess, error: "Invaild email or password" });
      }
      //   compreing that password correct or not
      const passwordCompre = await bcrypt.compare(password, user.password);
      if (!passwordCompre) {
        return res.status(400).json({sucess, error: "Invaild email or password" });
      }

      let data = {
        user: {
          id: user.id,
        },
      };

      //   sign in JWT token
      const authToken = jwt.sign(data, JWT_SECRET);

      //   send token to data base
      sucess= true;
      res.json({sucess, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({sucess, massage:error.message});
    }
  }
);

//  ROUTE 2: Authentice a user using: POST '/api/auth/login', login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Sorry Some Internal Error occured");
  }
});

module.exports = router;
