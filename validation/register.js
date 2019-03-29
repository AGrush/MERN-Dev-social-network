const Validator = require("validator");
const isEmptyAG = require("./is-empty");

//export to access from outside
module.exports = function validateRegisterInput(data) {
  let errors = {};

  //if it is empty we turn it into a string for Validator to work
  data.name = !isEmptyAG(data.name) ? data.name : "";
  data.email = !isEmptyAG(data.email) ? data.email : "";
  data.password = !isEmptyAG(data.password) ? data.password : "";
  data.password2 = !isEmptyAG(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be between 6 annd 30 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords don't match";
  }

  //Validator.isEmpty method only works with strings so we need out own function isEmpty to check a varible
  //isEmpty returns true is there are no errors
  return {
    errors: errors,
    isValid: isEmptyAG(errors)
  };
};
