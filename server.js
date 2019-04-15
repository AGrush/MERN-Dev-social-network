const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
const passport = require("passport");
const app = express();
const path = require("path");
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

//Passport middleware
app.use(passport.initialize());
// Passport Config
require("./config/passport")(passport);

// Use Routes (what url we want, where the file is for it)
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//Server static assets if in production //check we're in production
if (process.env.NODE_ENV === "production") {
  //set a static folder the client build foldler
  app.use(express.static("client/build"));
  //create our route, get anything thats not the above 3 API routes to load the index.html from build folder
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
//the port on heroku OR local
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
