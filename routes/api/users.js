const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
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
  //we're going to use mongoose to first find if the email exists
  //when we send data to a route with a form.. we access it with req.body
  //findOne is a mongoose method (uses promises/callbacks)
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
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
  //put the form variables into variables
  const email = req.body.email;
  const pass = req.body.password;

  //Find user by email
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User not found" });
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
          return res.status(400).json({ password: "Password incorrect" });
        }
      });
  });
});

//we have to export the router for server.js to pick it up
module.exports = router;
