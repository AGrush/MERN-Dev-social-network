const Validator = require("validator");
const isEmptyAG = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmptyAG(data.text) ? data.text : "";

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  return {
    errors,
    isValid: isEmptyAG(errors)
  };
};
