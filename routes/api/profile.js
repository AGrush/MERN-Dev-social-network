const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load profile model
const Profile = require("../../models/Profile");
//Load user profile
const User = require("../../models/User");

//whe we create a test route that will return a json object
// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
//router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// prettier-ignore
// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
  .then(profile => {
    if (!profile) {
      errors.noprofile = 'There is no profile for this user'
      return res.status(404).json(errors);
    }
    res.json(profile);
  })
  .catch(err=> res.status(404).json(err))
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get fields from req.body and fill this object with them
    const profileFields = {};
    //get the user from the logged in user id
    profileFields.user = req.user.id;
    //check if this was sent in from the form, if so set it the the profileFields object to that
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Spilt into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }

    // Social // in the profile model social field are enclosed by is an extra 'social' object so we need to initialise it here as it doesn't exitst yet.
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // find user by the logged in user
    Profile.findOne({ user: req.user.id }).then(profile => {
      //check to see if the profile exists, if it does then this is an UPDATE
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          //who do we want to update
          { user: req.user.id },
          //set the new object we just created
          { $set: profileFields },
          //new option
          { new: true }
          //responds with the new profile as a promise
        ).then(profile => res.json(profile));
      } else {
        // CREATE profile if it doesn't exist

        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);
//we have to export the router for server.js to pick it up
module.exports = router;
