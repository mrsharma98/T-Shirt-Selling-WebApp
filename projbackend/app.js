// this is for process(eg:- process -- variable used in setting port)
//  and create an environment variable file called ".env"
require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express")

const app = express()

// process --> where it attacj=hes all the dependencies
// .env --> file name of enviroment variable
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("DB CONNECTED");
})

// evn.port is for production level port or environment port
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`app is running at ${port}`);
})
