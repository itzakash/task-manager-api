const mongoose = require("mongoose");
const connection_url = process.env.MONGODB_URL || "mongodb://localhost:27017";
// mongoose.connect(connection_url, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// });

async function connectToDatabase() {
  try {
    await mongoose.connect(connection_url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToDatabase();
