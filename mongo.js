const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("You neet to at least provide a password.");
  console.log("Usage: node mongo.js <PASSWORD> [NAME] [NUMBER]");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@fso1.lm0iv.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length > 3) {
  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${name} to phonebook with number ${number}`);
    mongoose.connection.close();
  });

} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}