'use strict';

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const uuid = require('uuid');

const { DATABASE, PORT } = require('./config');

const app = express();

const news = {
  create: function (title, url, votes) {
    console.log('Creating new posts list item');
    const item = {
      title: title,
      id: uuid.v4(),
      url: url,
      votes: votes,
    };
  },
  update: function (updatedItem) {
    console.log(`Updating item \`${updatedItem.id}\``);
    // console.log(`testing updated item \`${updatedItem.title}\``);
     //updatedItem = updatedItem.votes++;
    
    // const { id } = updatedItem;
    // if (!(id in this.items)) {
    //   throw (`Can't update item \`${id}\` because doesn't exist.`);
    // }
    // this.items[votes.id] = votes;
    // return votes;

  }
};

app.use(morgan(':method :url :res[location] :status'));

app.use(bodyParser.json());

app.get('/api/stories', (req, res) => {
  knex.select('title', 'url', 'votes')
    .from('news')
    .orderBy('votes', 'asc')
    .limit(20)
    .returning('title', 'url', 'votes')
    .then(results => {
      res.json(results);
    });

});


app.post('/api/stories', jsonParser, (req, res) => {
  const requiredFields = ['title', 'url', 'votes'];

  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  knex('news')
    .insert({
      title: req.body.title,
      url: req.body.url,
      votes: req.body.votes

    }).returning(['title', 'url', 'votes'])
    .limit(10)

  // res.status(201).json(item);

    .then(result => {
      console.log(JSON.stringify(result[0], null, 2));

      res.sendStatus(200);
    });

});

app.put('/api/stories/:id', jsonParser, (req, res) => {

//   const status = validateNews(req.body);

//   if (!status.isValid) {
//     const message = `Missing \`${status.error}\` in request body`;
//     return res.status(422).send(message);
//   }

  const updatedItem = news.update({
    id: req.params.id,
    title: req.body.title,
    url: req.body.url,
    votes: req.body.votes
  });
  res.status(200).json(updatedItem);

knex.select('title', 'votes')
    .from('news')
    .update('votes', req.body.votes++)
    .then(results => res.send(results));


  //counter 
  //req.body.votes

  const item = news.update(req.body.title, req.body.url, req.body.votes);

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