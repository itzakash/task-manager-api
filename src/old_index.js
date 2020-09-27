const express = require('express');
require('./db/mongoose');
const Users = require('./models/user');
const Tasks = require('./models/tasks');

const app = express();
const port = process.env.PORT || 3000;
const log = console.log;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello akash  ');
});

//create new user

app.post('/users', (req, res) => {
  const user = new Users(req.body);

  user
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

// Fetching the all users

app.get('/users', (re, res) => {
  Users.find({})
    .then((result) => {
      if (result.length == 0) {
        res.status(204);
      }
      res.send(result);
      console.log(result);
    })
    .catch((e) => {
      res.status(500);
      res.send(e);
    });
});

// Get single records

app.get('/users/:id', (req, res) => {
  Users.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        res.status(204).send();
      }
      res.send(user);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

// create a tasks

app.post('/tasks', (req, res) => {
  const task = new Tasks(req.body);

  task
    .save()
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

app.listen(port, () => {
  console.log(' Server is up on port : ', port);
});
