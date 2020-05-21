const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

const validateId = (req, res, next) => {
  db('accounts').where({ id: req.params.id})
  .then(response => {
    if (response.length !== 0) {
      next()
    } else {
      res.status(400).json({ message: "invalid id" })
    }
    
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error)
  })
}

const validateNewAccount = (req, res, next) => {
  if (!("name" in req.body) || !("budget" in req.body)) {
    res.status(400).json({ message: "missing required field(s)"})
  } else {
    next()
  }
}

server.use(express.json());
server.use('/:id', validateId)
server.post('/', validateNewAccount)

server.get('/', (req, res) => {
  db('accounts')
  .then(response => {
    res.status(200).send(response)
  })
  .catch(error => {
    res.status(500).send(error)
  })
})

server.get('/:id', (req, res) => {
  db('accounts').where({ id: req.params.id})
  .then(response => {
    res.status(200).send(response)
  })
  .catch(error => {
    res.status(500).send(error)
  })
})

server.post('/', (req, res) => {
  db('accounts').insert(req.body)
  .then(response => {
    res.status(201).send(response)
  })
  .catch(error => {
    res.status(500).send(error)
  })
})

server.put('/:id', (req, res) => {
  db('accounts').where({ id: req.params.id }).update(req.body)
  .then(response => {
    res.status(201).json(response)
  })
  .catch(error => {
    res.status(500).send(error)
  })
})

server.delete('/:id', (req, res) => {
  db('accounts').where({ id: req.params.id }).delete()
  .then(response => {
    res.status(201).json(response)
  })
  .catch(error => {
    res.status(500).send(error)
  })
})
module.exports = server;
