const express = require("express");
const app = express();

app.use(express.json());

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];


function generateId(persons) {
  let newId = Math.ceil(Math.random() * 9999);
  if (persons.find(person => person.id === newId)) {
    return generateId(persons);
  } else {
    return newId;
  }
}


app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has information about ${persons.length} people.<p>
    <p>${Date()}</p>
  `);
});


app.get("/api/persons", (_, res) => {
  res.json(persons);
});


app.get("/api/persons/:id", (req, res) => {
  console.log("Getting person");
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (!person) {
    res.status(404).end();
  } else {
    res.json(person);
  }
});


app.post("/spo/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "Name and number must be filled in."
    });
  }

  if (persons.find(person => person.name.toLowerCase() ===
      req.body.name.trim().toLowerCase())) {
    return res.status(400).json({
      error: `There is already a person called ${req.body.name} in the phonebook.`
    })
  }

  const person = {
    id: generateId(),
    name: req.body.name.trim(),
    number: req.body.number
  }

  persons = persons.concat(person);
  res.json(person);
});


app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);

  res.status(204).end();
})


const PORT = 3001;
app.listen(PORT);
console.log(`Server listening on port ${PORT}`);