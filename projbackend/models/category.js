const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 32,
    unique: true
  }
}, { timestamps: true })
// here this will record the creation time of the category and store it to db.

module.export = mongoose.model("Category", categorySchema)