require("dotenv").config();

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const mongodb_url = process.env.MONGODB_URL;

mongoose.connect(mongodb_url)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true
  }
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model("Person", personSchema);