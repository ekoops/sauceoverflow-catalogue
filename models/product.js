import mongoose1 from "../db.js";
import { commentSchema } from "./comment.js";

const productSchema = new mongoose1.Schema(
  {
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
    comments: {
      type: [commentSchema],
      default: [],
    },
    category: {
      type: String,
      enum: ["STYLE", "FOOD", "TECH", "SPORT"],
      message: "{VALUE} is not supported",
    },
    starsSum: {
      type: Number,
      default: 0,
    },
    commentsNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
  }
);

productSchema.virtual("stars").get(function () {
console.log( this, this.commentsNumber)
  return this.commentsNumber > 0 ? this.starsSum / this.commentsNumber : 0;
});

const Product = mongoose1.model("Product", productSchema);

export default Product;
