const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Mongo DB Connected"))
  .catch(err => console.log(err));

//basic route
app.get("/", (req, res) => res.send("Hello world"));

// Use Routes (what url we want, where the file is for it)
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//the port on heroku OR local
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
