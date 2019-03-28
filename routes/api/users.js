const express = require("express");
const router = express.Router();

//whe we create a route that will return a json object
// @route   GET api/profile/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//we have to export the router for server.js to pick it up
module.exports = router;
