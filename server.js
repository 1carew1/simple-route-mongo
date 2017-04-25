import config from './config/config';
import { Mockgoose } from 'mockgoose';
import { nodeEnv } from './config/config';
import express from 'express';
import basicAuth from 'express-basic-auth';
import bodyParser from 'body-parser';
import directionsRouterV1 from './api/v1/directions';
import userPreferecnesRouterV1 from './api/v1/user_preferences';
import mongoose from 'mongoose';
import cors from 'cors';

import allowedUsers from './config/allowedUsers';

// Connect to database
if (nodeEnv == 'test') {
    //use mockgoose for testing
    const mockgoose = new Mockgoose(mongoose);
    mockgoose.prepareStorage().then(() => {
        mongoose.connect(config.mongoDb);
    });
} else {
    //use real deal for everything else
    mongoose.connect(config.mongoDb);
}
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

export const server = express();
server.use(cors());
server.use(express.static('public'));
//From here on out the links are authenticated
// Need to send this in the header : Authorization:Basic dXNlcm5hbWU6cGFzc3dvcmQ=
const users = {};
allowedUsers.forEach((allowedUser) => {
    users[allowedUser.username] = allowedUser.password;
});
server.use(basicAuth({
    users: users
}));

//configure body-parser
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

const baseApiUrl = '/api/v1/';

server.use(baseApiUrl + 'directions', directionsRouterV1);
server.use(baseApiUrl + 'userPreferences', userPreferecnesRouterV1);


server.listen(config.port, config.host, () => {
    console.info('listening : ' + config.port);
});
