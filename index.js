const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const Queue = require('./queue');
const {PORT, CLIENT_ORIGIN} = require('./config');
// const {dbConnect} = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const app = express();
const catQueue = new Queue();
const dogQueue = new Queue();

catQueue.enqueue({
  imageURL:'http://r.ddmcdn.com/s_f/o_1/APL/uploads/2014/10/american-bobtail-1-.jpg',
  imageDescription: 'American Bobtail cat named Doug.',
  name: 'Doug',
  sex: 'Male',
  age: 21,
  breed: 'American Bobtail',
  story: 'Unknown'
});
catQueue.enqueue({
  imageURL:'http://r.ddmcdn.com/s_f/o_1/APL/uploads/2014/12/ragdoll-1-.jpg',
  imageDescription: 'Ragdoll cat.',
  name: 'RD',
  sex: 'Female',
  age: 4,
  breed: 'Ragdoll',
  story: 'Owner tried to eat her'
});
catQueue.enqueue({
  imageURL:'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg',
  imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
  name: 'Fluffy',
  sex: 'Female',
  age: 2,
  breed: 'Bengal',
  story: 'Thrown on the street'
});
dogQueue.enqueue({
  imageURL: 'https://i.pinimg.com/originals/a5/c5/83/a5c5837fb114d5e327f1cbd5d44f6486.jpg',
  imageDescription: 'Happily sleeping french bulldog.',
  name: 'Blue',
  sex: 'Male',
  age: 2,
  breed: 'French Bulldog',
  story: 'Stole from owner'
});
dogQueue.enqueue({
  imageURL: 'https://s-media-cache-ak0.pinimg.com/originals/b6/8c/34/b68c3499c48ab479f364c7fd0c5fd41e.jpg',
  imageDescription: 'Cool dog.',
  name: 'Shades',
  sex: 'Male',
  age: 3,
  breed: 'Corgi',
  story: 'Was too cool for owner'
});
dogQueue.enqueue({
  imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
  imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
  name: 'Zeus',
  sex: 'Male',
  age: 3,
  breed: 'Golden Retriever',
  story: 'Owner Passed away'
});

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);


app.get('/api/cat', (req, res) => {
  if (!catQueue.first) {
    console.log('no more cats');
    res.send('no more cats');
  }
  res.json(catQueue.first.value);
});

app.get('/api/dog', (req, res) => {
  if (!dogQueue.first) {
    console.log('no more dogs');
    res.send('no more dogs');
  }
  res.json(dogQueue.first.value);
});

app.delete('/api/cat', (req, res) => {
  if (!catQueue.first) {
    console.log('no more cats');
    res.send('no more cats');
  }
  catQueue.dequeue();
  res.status(204).json({message: 'success'});
});

app.delete('/api/dog', (req, res) => {
  if (!dogQueue.first) {
    console.log('no more dogs');
    res.send('no more dogs');
  }
  dogQueue.dequeue();
  res.status(204).json({message: 'success'});
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
//   dbConnect();
  runServer();
}

module.exports = {app};
