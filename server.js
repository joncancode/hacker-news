'use strict'; 

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { DATABASE, PORT } = require('./config');

const app = express();

app.use(morgan(':method :url :res[location] :status'));

app.use(bodyParser.json());

app.get('/api/stories', (req, res) => {
  knex.select('title', 'url','votes') 
    .from('news')
    .orderBy('votes', 'asc')
    .limit(20)
    .returning('title', 'url','votes')
    .then(results => {res.json(results);
      console.log('line 20 the magic');

    }); 

  //  console.log(results);
  // res.send('GET world');
   
});

app.post('/api/stories', jsonParser, (req, res) => {
  const requiredFields = ['title', 'url'];

  res.send('POST world');
  res.sendStatus(201);
});

app.put('/api/stories/:id', (req, res) => {
  
  res.send('UPDATE world');
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