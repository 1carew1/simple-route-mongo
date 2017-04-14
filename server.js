import config from './config';
import express from 'express';
//import contactsRouter from './api/contacts';
import bodyParser from 'body-parser';
//import postsRouter from './api/posts';
import directionsRouter from './api/directions';
import mongoose from 'mongoose';
import {loadDirections} from './directionData';

// Populate DB with sample data
if(config.seedDb) {
    loadDirections();
}

const server = express();
//configure body-parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(express.static('public'));
server.use('/api/directions', directionsRouter);


server.listen(config.port, config.host, () => {
  console.info('http://' + config.host + ':' + config.port);
});