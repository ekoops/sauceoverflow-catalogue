import mongoose1 from "../db.js";
import { commentSchema } from "./comment.js";

const productSchema = new mongoose1.Schema({
  name: {
    type: String,
    required: [true, "The product name is required"],
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  description: String,
  price: {
    type: Number,
    min: [0, "The product price must be positive"],
  },
  comments: [commentSchema],
  category: {
    type: String,
    enum: ["STYLE", "FOOD", "TECH", "SPORT"],
    message: "{VALUE} is not supported",
  },
  stars: {
    type: Number,
    default: 0
  },
  starsSum: {
    type: Number,
    default: 0,
  },
  commentsNumber: Number
}, {
  toJSON: {
    virtuals: true
  }
});

// productSchema.virtual()

const Product = mongoose1.model("Product", productSchema);

export default Product;
