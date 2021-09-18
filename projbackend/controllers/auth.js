const User = require("../models/user")
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


exports.signup = (req, res) => {

  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)

  if(!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
      // field: errors.array()[0].param,
    })
  }

  // req.body -- body-parse makes it available
  // gives the data passed with post req (req.body)
  const user = new User(req.body)
  user.save((err, user) => {
    // err is error
    // user -> an obj saved in the data, we can call it anything
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      })
    }

    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    })
  })
  // mongoose method to interact with mongodb
}

exports.signin = (req, res) => {
  const errors = validationResult(req)
  const { email, password } = req.body

  if(!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    })
  }

  User.findOne({email}, (err, user) => {
    // if error occurs -- basically when email does not exist
    if (err || !user) {
      return res.status(400).json({
        error: "User email does not exists"
      })
    }

    // checking for password
    if(!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      })
    }

    // if email and password is correct
    // create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET)
    // put token in cookie
    res.cookie("token", token, {expire: new Date() + 9999})
    // cookie(key, value, {expirationTime})

    // send response to frontend
    const { _id, name, email, role } = user
    return res.json({ token, user: { _id, name, email, role } })

  })
}

exports.signout = (req, res) => {
  // clearing the user cookie
  res.clearCookie("token")
  res.json({
    message: "User signout successfully"
  })
}


// protected routes
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth"
  // once we are giving a middleware, means using isSignedIn in any route
  // it just adds a new property in the user request(req) named userProperty
  // auth actually holds an _id, which is same as _id given to us while signin
})

// custom middilewares
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id
  // profile will be set from frontend
  // auth is what we added while signin
  // checking if _id set by profile(by frontend) and _id by set by middleware (isSignedIn -- auth) is same

  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED"
    })
  }

  next()
}

exports.isAdmin = (req, res, next) => {
  if(req.profile.role === 0) {
    return res.status(403).json({
      error: "You are not ADMIN, Access denied"
    })
  }

  next()
}