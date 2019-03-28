const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Import User model
const User = require("../../models/User");

//whe we create a route that will expect a GET request and return a json object
// @route   GET api/profile/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//whe we create a route that will expect a POSE request and return a json object
// @route   POST api/users/register
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

//we have to export the router for server.js to pick it up
module.exports = router;
