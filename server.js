const express = require("express");

const app = express();

//basic route
app.get("/", (req, res) => res.send("Hello world"));

//the port on heroku OR local
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
