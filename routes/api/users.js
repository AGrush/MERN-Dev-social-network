const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//Import Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Import User model
const User = require("../../models/User");

//we create a route that will expect a GET request and return a json object
// @route   GET api/profile/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//we create a REGISTRATION route that will expect a POST request and return a json object
// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  //VALIDATION TO BE USED ON ANY ROUTE
  //put the request through our register.js validation function and pull out the returned errors and isValid from the response body using destructuring
  const { errors, isValid } = validateRegisterInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //we're going to use mongoose to first find if the email exists
  //when we send data to a route with a form.. we access it with req.body
  //findOne is a mongoose method (uses promises/callbacks)
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json({ errors });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "pg", //rating
        d: "mm" // default
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });
      //generate salt
      bcrypt.genSalt(10, (err, salt) => {
        // once we get that salt we want to generate a hash (or error) with the salt and the newUser password we just got..
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          //throw error if there is one
          if (err) throw err;
          //set the password as the new hashed password
          newUser.password = hash;
          //mongoose method .save() the newUser, take the response promise and .then output the new user object as json
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// we create a LOGIN route that will expect a GET request and return a TOKEN
// @route   GET api/users/login
// @desc    Login User/ Return JWT Token
// @access  Public
router.post("/login", (req, res) => {
  //VALIDATION TO BE USED ON ANY ROUTE
  //put the request through our register.js validation function and pull out the returned errors and isValid from the response body using destructuring
  const { errors, isValid } = validateLoginInput(req.body);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //put the form variables into variables
  const email = req.body.email;
  const pass = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json({ errors });
    }

    // Check login password (pass) with registered hash password using bcrypt.compare
    bcrypt
      .compare(pass, user.password)
      //return true/false boolean promise
      .then(isMatch => {
        if (isMatch) {
          // User Matched

          //create JWT paylaod
          const payload = { id: user.id, name: user.name, avatar: user.avatar };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          errors.password = "Password incorrect";
          return res.status(400).json({ errors });
        }
      });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  //passport.authenticate as second param, 'jwt' strategy, not using session, callback request response
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //res.json({ msg: "success" });
    //res.json(req.user); would be the full response of all user details (inc password)
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

//we have to export the router for server.js to pick it up
module.exports = router;
