const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema, what is our users collection going to have?
const UserSchema = new Schema({
  //define the name field
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//export it to a variable User........(name we want to use, the actual schema)
module.exports = User = mongoose.model("users", UserSchema);
