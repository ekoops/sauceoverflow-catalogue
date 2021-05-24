import mongoose from "mongoose";

const mongoose1 = await mongoose.connect("mongodb://localhost:27017/sauceoverflow-catalogue", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose1.set("runValidators", true)
export default mongoose1;
