const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema


const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product"
  },
  name: String,
  count: Number,
  price: Number
})

const ProductCart = mongoose.model("ProductCart", ProductCartSchema)


const OrderSchema = new mongoose.Schema({
  // A Order can contain multiple item with more than one in quantity per item/product
  // so making a products array
  //  Eg: 2 hardisk and 10 USB cables
  products: [ProductCartSchema],
  transaction_id: {},
  amount: {
    type: Number
  },
  address: String,
  status: {
    type: String,
    default: "Recieved",
    enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
  },
  updated: Date,
  user: {
    type: ObjectId,
    ref: "User"
  }
}, { timestamps: true })


const Order = mongoose.model("Order", OrderSchema)

module.exports = { Order, ProductCart }