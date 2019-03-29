const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  //payload from users.js
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //console.log(jwt_payload)
      //User model, mongoose method findById using the payload.id, gives us a promise back.
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            //done function takes in the error null & user
            return done(null, user);
          }
          //done function takes in the error null & there is no user
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
