require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./model/person");
const note = require("../fso-part3-notes/models/note");


app.use(express.json());
app.use(express.static("build"));

app.use(cors());

morgan.token("req-body", (req, _) => {return JSON.stringify(req.body)});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));


function generateId(persons) {
  let newId = Math.ceil(Math.random() * 9999);
  if (persons.find(person => person.id === newId)) {
    return generateId(persons);
  } else {
    return newId;
  }
}


app.get("/info", (_, res) => {
  Person.find({}).then(persons => {
    res.send(`
    <p>Phonebook has information about ${persons.length} people.<p>
    <p>${Date()}</p>
  `);
  });
});


app.get("/api/persons", (_, res) => {
  Person.find({}).then(persons => res.json(persons));
});


app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then(note => res.json(note));
});


app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "Name and number must be filled in."
    });
  }

  // if (Person.find()person => person.name.toLowerCase() ===
  //     req.body.name.trim().toLowerCase())) {
  //   return res.status(400).json({
  //     error: `There is already a person called ${req.body.name} in the phonebook.`
  //   })
  // }

  const person = new Person ({
    name: req.body.name.trim(),
    number: req.body.number
  });

  person.save().then(savedPerson => res.json(savedPerson));
});


app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
})


const PORT = process.env.PORT;
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
});