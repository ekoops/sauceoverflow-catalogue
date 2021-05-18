import mongoose from "mongoose";


// try {
const mongoose1 = await mongoose.connect("mongodb://localhost:27017/sauceoverflow-catalogue", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// } catch (ex) {
//   console.error(ex);
//
// }
export default mongoose1;
