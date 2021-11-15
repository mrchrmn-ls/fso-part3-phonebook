require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./model/person");


app.use(express.json());
app.use(express.static("build"));

app.use(cors());

morgan.token("req-body", (req, _) => {return JSON.stringify(req.body)});
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"));


function unknownEndpoint(_, res) {
  res.status(404).send({
    error: "Unknown endpoint"
  });
}


function errorHandler(err, _, res, next) {
  console.log(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(err);
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


app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.json(person);
    } else {
      res.status(404).end();
    }
  })
  .catch(error => next(error));
});


app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error));
});
  
  
app.post("/api/persons", (req, res) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      error: "Name and number must be filled in."
    });
  }

  const person = new Person ({
    name: req.body.name.trim(),
    number: req.body.number
  });

  person.save().then(savedPerson => res.json(savedPerson));
});


app.put("/api/persons/:id", (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
});


app.use(unknownEndpoint);
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, ()=> {
  console.log(`Server running on port ${PORT}`);
});