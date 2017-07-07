'use strict'; 

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { DATABASE, PORT } = require('./config');

const app = express();

app.use(morgan(':method :url :res[location] :status'));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/api/stories', jsonParser, (req, res) => {
  const requiredFields = ['title', 'url'];

  res.send('hello world');
  res.sendStatus(201);
});

app.put('/', (req, res) => {
  
  res.send('hello world');
});



let server;
let knex;
function runServer(database = DATABASE, port = PORT) {
  return new Promise((resolve, reject) => {
    try {
      knex = require('knex')(database);
      server = app.listen(port, () => {
        console.info(`App listening on port ${server.address().port}`);
        resolve();
      });
    }
    catch (err) {
      console.error(`Can't start server: ${err}`);
      reject(err);
    }
  });
}

function closeServer() {
  return knex.destroy().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing servers');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => {
    console.error(`Can't start server: ${err}`);
    throw err;
  });
}

module.exports = { app, runServer, closeServer };