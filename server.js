import config from './config';
import {Mockgoose} from 'mockgoose';
import {nodeEnv}  from './config';
import express from 'express';
import basicAuth from 'basic-auth-connect';
//import contactsRouter from './api/contacts';
import bodyParser from 'body-parser';
//import postsRouter from './api/posts';
import directionsRouterV1 from './api/v1/directions';
import userPreferecnesRouterV1 from './api/v1/user_preferences';
import mongoose from 'mongoose';

// Connect to database
if (nodeEnv == 'test'){
//use mockgoose for testing
  const mockgoose = new Mockgoose(mongoose); 
  mockgoose.prepareStorage().then(()=>{
  mongoose.connect(config.mongoDb);
  });
}
else
{
//use real deal for everything else
  mongoose.connect(config.mongoDb);
}
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error: '+ err);
  process.exit(-1);
});

export const server = express();
// Need to send this in the header : Authorization:Basic dXNlcm5hbWU6cGFzc3dvcmQ=
server.use(basicAuth('username', 'password'));
//configure body-parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true}));
server.use(express.static('public'));
const baseApiUrl = '/api/v1/';

server.use(baseApiUrl + 'directions', directionsRouterV1);
server.use(baseApiUrl + 'userPreferences', userPreferecnesRouterV1);


server.listen(config.port, config.host, () => {
  console.info('listening : ' + config.port);
});