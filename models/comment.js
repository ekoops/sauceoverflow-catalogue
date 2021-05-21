import mongoose1 from "../db.js";

export const commentSchema = new mongoose1.Schema({
  title: {
    type: String,
    required: [true, "The comment title is required"]
  },
  body: String,
  stars: {
    type: Number,
    min: [1, "The max number of stars is 1"],
    max: [5, "The max number of stars is 5"]
  },
  date: {
    type: Date,
    default: () => new Date()
  },
});

const Comment = mongoose1.model("Comment", commentSchema);

export default Comment;