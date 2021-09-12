const mongoose = require("mongoose")
const crypto = require("crypto")
const { v4: uuidv4 } = require('uuid');


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 32,
    trim: true
  },
  lastname: {
    type: String,
    maxlength: 32,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  userinfo: {
    type: String,
    trim: true
  },
  encry_password: {
    type: String,
    required: true
  },
  salt: String,
  role: {
    type: Number, // higher the no, more the previlegs
    default: 0
  },
  purchases: {
    typr: Array,
    default: []
  }
}, { timestamps: true })


// Virtual fields
userSchema.virtual("password")
  .set(function (password) {
    this._password = password  // just storing in a variable (not a variable declared anywhere)
    this.salt = uuidv4() // salt field is what we declared above
    this.encry_password = this.securePassword(password)  // encry_password is also something we declared above
  })
  .get(function () {
    return this._password
  })


// Schema methods 
userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return ""
    try {
      return crypto.createHmac('sha256', this.salt)
        .update(plainpassword)
        .digest('hex');
    } catch (err) {
      return ""
    }
  }
}


module.exports = mongoose.model("User", userSchema)
// exporting model -- module.export
// model(nameOfTheSchema, actualSchema)