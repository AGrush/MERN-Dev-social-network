const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//Load profile model
const Profile = require("../../models/Profile");
//Load user profile
const User = require("../../models/User");

//whe we create a test route that will return a json object
// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
//router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};

  //find finds ALL the profiles
  Profile.find()
    .populate("user", ["name", "avatar"])
    //profiles plural!
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    //custom error object
    .catch(err => res.status(404).json({ profile: "There are no profiles" }));
});

// prettier-ignore
// @route   GET api/profile/handle/:handle
// @desc    Get PUBLIC profile by handle
// @access  Public //anyone can see profiles (no need or passport)
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  //mongoose method findOne to find a handle in the Model Schema that matches the urls :handle.
  Profile.findOne({ handle: req.params.handle })
    //populate namea nd avatar from the user in ProfileSchema
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  //mongoose method findOne to find a handle in the Model Schema that matches the urls :user_id.
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err =>
      //custom error object
      res.status(404).json({ profile: "There is no profile for this user" })
    );
});

// prettier-ignore
// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
  //since our Profile Schema has ref:'users'
  //populate from user
  .populate('user', ['name', 'avatar'])
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
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //put the request through our profile.js validation function and pull out the returned errors and isValid from the response body using destructuring,
    const { errors, isValid } = validateProfileInput(req.body);

    // isValid should return true if there were no errors in the validation function.
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

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

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    //we wanna find by the logged in user, and the req.user.id comes from the token
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to the front of exp array
      profile.experience.unshift(newExp);

      //save gives a promise, which returns the saved profile which we respond with
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   POST api/profile/education
// @desc    Add education to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to edu array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// when the experience created it gets an id that we can see in postman.
// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // create a variable removeIndex which is the index of the experience item we want to delete
        const removeIndex = profile.experience
          //take the item and map it to an array of item.ids
          .map(item => item.id)
          //get the index of the item that matches the url :exp_id variable
          .indexOf(req.params.exp_id);

        // Splice out of array the experience item at removeIndex
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // Get remove index
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array
        profile.education.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //mongoose method.
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

//we have to export the router for server.js to pick it up
module.exports = router;
