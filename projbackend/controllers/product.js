const Product = require("../models/product")

const Formidable = require('formidable');
const _ = require("lodash")
const fs = require("fs")
// const { formidable } = require("formidable")


exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
  .populate("category")
  .exec((err, product) => {
    if(err, !product) {
      return res.status(400).json({
        error: "Product not found"
      })
    }

    req.product = product
    next()
  })
}

exports.createProduct = (req, res) => {
  let formidable = new Formidable.IncomingForm()
  // creating an obj for form
  // expects 3 parameters:- err, fields(name, descriptions and all), files
  formidable.keepExtensions = true // whether png, jpg or something else

  formidable.parse(req, (err, fields, file) => {
    if (err){
      return res.status(400).json({
        error: "problem with image"
      })
    }

    // destructure the fields
    const { name, description, price, category, stock } = fields

    // validation
    if( !name || !description || !price || !category || !stock ) {
      return res.status(400).json({
        error: "Please include all fields"
      })
    }


    let product = new Product(fields)

    // handle file here
    if (file.photo) {
      // photo name is not depenedent on model, we can name it anything
      if (file.photo.size > 3000000) {
        // 3MB
        return res.status(400).json({
          error: "File size too big!"
        })
      }

      product.photo.data = fs.readFileSync(file.photo.path)
      // mentioning the path (.data is in model)
      product.photo.contentType = file.photo.type
    }

    // save to the DB
    product.save((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Saving tshirt in DB failed"
        })
      }

      res.json(product)
    })

  })




  const product = new Product(req.product)
}