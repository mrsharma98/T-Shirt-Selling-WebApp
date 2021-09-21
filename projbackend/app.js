// this is for process(eg:- process -- variable used in setting port)
//  and create an environment variable file called ".env"
require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const cors = require("cors")

// MIDDLEWARES
app.use(bodyParser.json())
// app.use(middleware_name) --> basic syntax for middleware
app.use(cookieParser())
// cookiesParse -- helps to put or deleted some values to into the user's browser.
app.use(cors())

// My routes
const authRoutes = require('./routes/auth')
const userRouters = require('./routes/user')
const categoryRouters = require('./routes/category')
const productRouters = require("./routes/product")


// DB CCONNECTION
// process --> where it attaches all the dependencies
// .env --> file name of enviroment variable
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log("DB CONNECTED");
})


// MY ROUTES

// here I can use route, domain/api/routers (routers-- can be any route)
// "/api" is a prefix
app.use("/api", authRoutes);
app.use("/api", userRouters);
app.use("/api", categoryRouters);
app.use("/api", productRouters);



// PORT
// evn.port is for production level port or environment port
const port = process.env.PORT || 8000


// STARTING A SERVE
app.listen(port, () => {
  console.log(`app is running at ${port}`);
})
