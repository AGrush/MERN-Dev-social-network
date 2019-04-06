const Validator = require("validator");
const isEmptyAG = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  //turns the undefined or null into an empty string so that we can use the validators isEmpty which only takes string values.
  data.title = !isEmptyAG(data.title) ? data.title : "";
  data.company = !isEmptyAG(data.company) ? data.company : "";
  data.from = !isEmptyAG(data.from) ? data.from : "";

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors,
    isValid: isEmptyAG(errors)
  };
};
