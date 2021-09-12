const User = require("../models/user")
const { check, validationResult } = require('express-validator');

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

exports.signout = (req, res) => {
  res.json({
    message: "User signout"
  })
}