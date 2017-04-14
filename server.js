import config from './config';
import express from 'express';
//import contactsRouter from './api/contacts';
import bodyParser from 'body-parser';
//import postsRouter from './api/posts';
import directionsRouter from './api/directions';
import mongoose from 'mongoose';
import {loadDirections} from './directionData';

// Connect to database
mongoose.connect(config.mongoDb);

const server = express();
//configure body-parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true}));
server.use(express.static('public'));
server.use('/api/directions', directionsRouter);


server.listen(config.port, config.host, () => {
  console.info('http://' + config.host + ':' + config.port);
});