const Product = require("../models/product")

const Formidable = require('formidable');
const _ = require("lodash")
const fs = require("fs")
// const { formidable } = require("formidable")


exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err, !product) {
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
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      })
    }

    // destructure the fields
    const { name, description, price, category, stock } = fields

    // validation
    if (!name || !description || !price || !category || !stock) {
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
          error: "Saving the product in DB failed"
        })
      }

      res.json(product)
    })
  })
}

exports.getProduct = (req, res) => {
  // things like mp3 or files are not served directly by a get req
  // so we will load it in the background by using middleware.
  req.product.photo = undefined
  return res.json(req.product)
}

// middleware for picture
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType)
    // setting the content-type (imp in files)
    return res.send(req.product.photo.data)
  }
  next()
}

exports.updateProduct = (req, res) => {
  let formidable = new Formidable.IncomingForm()
  formidable.keepExtensions = true 

  formidable.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "problem with image"
      })
    }

    // updation code
    let product = req.product
    product = _.extend(product, fields)
    // extend -- it takes the exisiting values we are having, and extends those values
    //  means involves those value. (it also updates the value)
    // fields gonna b updated inside the product
    //  in short, just updating the product obj swith new values using fields

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
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed"
        })
      }

      res.json(product)
    })
  })
}

exports.deleteProduct = (req, res) => {
  let product = req.product
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete the product"
      })
    }

    res.json({
      message: "Deletion was a success",
      deletedProduct
    })
  })
}

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product FOUND"
        })
      }

      res.json(products)
    })
}

// for getting distinct categories
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "NO category found"
      })
    }
    res.json(category)
  })
  // distinct for getting all the unique categories
  // distinct takes at least a field name.
}


exports.updateStock = (req, res, next) => {

  let myOperations = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: {_id: prod._id},
        update: {$inc: {stock: -prod.count, sold: +prod.count}}
      }
    }
  })

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed"
      })
    }
    next()
  })
}