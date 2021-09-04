const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema;


const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 32
  },
  description: {
    type: String,
    trim: true,
    required: true,
    maxlength: 2000
  },
  price: {
    type: Number,
    required: true,
    maxlength: 32,
    trim: true
  },
  // Defining Relationship
  category: {
    type: ObjectId,  // relation (we pass object id)
    ref: "Category",  // model name
    required: true
  },
  stock: {
    type: Number,
  },
  sold: {
    type: Number,
    default: 0
  },
  // Putting Image
  photo: {
    data: Buffer,
    contentType: String
  }
}, { timestamps: true })


module.export = mongoose.model("Product", productSchema)