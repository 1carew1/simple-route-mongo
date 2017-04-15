import config from './config';
import express from 'express';
//import contactsRouter from './api/contacts';
import bodyParser from 'body-parser';
//import postsRouter from './api/posts';
import directionsRouterV1 from './api/v1/directions';
import userPreferecnesRouterV1 from './api/v1/user_preferences';
import mongoose from 'mongoose';

// Connect to database
mongoose.connect(config.mongoDb);

const server = express();
//configure body-parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true}));
server.use(express.static('public'));
const baseApiUrl = '/api/v1/';

server.use(baseApiUrl + 'directions', directionsRouterV1);
server.use(baseApiUrl + 'userPreferences', userPreferecnesRouterV1);


server.listen(config.port, config.host, () => {
  console.info('http://' + config.host + ':' + config.port);
});