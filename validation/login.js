const Validator = require("validator");
const isEmptyAG = require("./is-empty");

//export to access from outside
module.exports = function validateLoginInput(data) {
  let errors = {};

  //if it is empty we turn it into a string for Validator to work
  data.email = !isEmptyAG(data.email) ? data.email : "";
  data.password = !isEmptyAG(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  //Validator.isEmpty method only works with strings so we need our own function isEmpty to check a varible
  //isEmpty returns true is there are no errors
  return {
    errors: errors,
    isValid: isEmptyAG(errors)
  };
};
