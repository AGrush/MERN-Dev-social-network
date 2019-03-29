const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    //this will associate the user by its ID
    type: Schema.Types.ObjectId,
    //we need to reference the collection that this refers to
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    //max characters
    max: 40
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    //in our form they will be able to input comment separated values
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String }
    }
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldofstudy: { type: String, required: true },
      from: { type: Date, required: true },
      to: { type: Date },
      current: { type: Boolean, default: false },
      description: { type: String }
    }
  ],
  social: {
    youtube: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    linkedin: { type: Date },
    instagram: { type: Date }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//Profile is an object with a model called profile with a ProfileSchema
module.exports = Profile = mongoose.model("profile", ProfileSchema);
