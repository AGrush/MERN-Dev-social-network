const express = require("express");
const mongoose = require("mongoose");

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Mongo DB Connected"))
  .catch(err => console.log(err));

//basic route
app.get("/", (req, res) => res.send("Hello world"));

//the port on heroku OR local
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
