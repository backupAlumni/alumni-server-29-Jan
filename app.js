//imports
const express = require("express");
const app = express();
const path = require("path");
const client  = require("./database/database");

//connect to database
client.connect();

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set up middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Routes
const indexRoute = require("./routes/index");
const alumniRoute = require("./routes/alumni");
const adminRoute = require("./routes/admin");

app.use("/", indexRoute);
app.use("/alumni", alumniRoute);
app.use("/admin", adminRoute);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});