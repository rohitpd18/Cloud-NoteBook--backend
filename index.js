const connectToMongo = require("./db");
const express = require("express");
var cors= require('cors')

// conntind to mongo
connectToMongo();
// creating app thorugh express
const app = express();
const port = 5000;

// for express validation
app.use(cors())
app.use(express.json());

// Avaliable Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// creating server and listing on port
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});



