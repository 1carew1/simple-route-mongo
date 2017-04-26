# Enterprise Web Development Assignment 2 - Node, Express, MongoDB and ReactJS app.

Name: Colm Carew

## Overview
Simple Route is a Web Application written using the React JavaScript Library, the original project of which can be found here : https://github.com/1carew1/simple-route. 

The core idea of the application is to create a Mongo + Express backend using Node JS in order to convey good design practice for APIs.
This API was then integrated with the previously mentioned React App to give the App a backend database.


### API Feature List
  
 + Version Control of the Rest Api - /api/v1
 + Basic HTTP Authentication for REST Calls via express-basic-auth
 + Ability to create/read/update/delete UserPreferences including User Locations which is a nested collection within User Preferences - /userPreferences
 + Ability to get all locations associated with the user - /userPreferences/:user_id/locations
 + Ability to create/read/update/delete Directions Searched by a User - /directions
 + Ability to search Directions Model via URL queries e.g. ?user_id=123&limit=10
 + Appropriate payload validation via mongoose and mongoose-unique-validator to ensure data is coherent

## Installation requirements.
Ensure you have a config folder in the root of this project with two files in it, allowedUsers.js and config.js.

allowedUsers.js is all of the allowed users who can access the REST API.
Ensure this file resembles :



export default [{
    username: "username",
    password: "password"
}, {
    username: "admin",
    password: "password"
}];



Note - you can add as many users as you would like to this file and they will be secured via express-basic-auth, so only those users may access the API.

For config.js ensure the file resembles :


const env = process.env;

export const nodeEnv = env.NODE_ENV || 'development';


export default {
  mongoDb: 'mongodb://mongo:27017/DATABASE_NAME',
  seedDb: true,
  port: env.PORT || 8090
};



Note port should be 8090 but this should also line up with the Docker files if you plan to run this with Docker.
Also note  mongoDb: 'mongodb://mongo:27017/simple_route'. If planning on running locally and not via Docker this should be changed to  mongoDb: 'mongodb://DATABASE_SERVER_NAME:27017/DATABASE_NAME'.


I have left the public folder with my compiled version of Simple Route, however if you would like to edit the Frontend and recompile you will need to set up the simpleRoute part of the project as in : https://github.com/1carew1/simple-route#installation-requirements, however you may ignore the Firebase Part. You will need to however add another file to the config folder of the simpleRoute folder. This file is called backendConfig.json and should look like : 


{
	"username": "username",
    "password": "password"
}

Note this is a username and password that is allowed to access the REST API of the backend.


+ Once completed, cd simpleRoute and run 'npm install'.
+ Once that has finished run './build_simpleroute.sh', this will create the production optimised version of the Frontend and place it in the public folder of the root project.
+ cd into the root of the project and run 'npm install'.
+ Once all packages are installed run 'npm start'.
+ If ports were left as default you should now be able to access the site via http://localhost:8090 and this should render the Simple Route frontend

If you would like to run the whole project via Docker and not install Mongo anywhere you may run


+ docker-compose rm -f 
+ docker-compose pull 
+ docker-compose up --build -d 
+ docker-compose up

This should now be available on http://localhost:8090 and running via Docker

### List of Software + Technologies Used
+ Jenkins 2.46.2
+ Docker 17.03.1
+ Node 6.10.0
+ npm 3.10.10
+ create-react-app tool
+ ReactJS v15.4.2
+ express 4.15.2
+ express-basic-auth 1.0.1
+ lodash 4.17.4
+ mocha 3.2.0
+ mochawesome 2.0.5
+ mockgoose 7.1.1
+ mongoose 4.9.4
+ mongoose-unique-validator 1.0.5
+ should 11.2.1
+ supertest 3.0.0
+ Bootstrap 3
+ React Google Maps 6
+ Superagent 3
+ React Select 1
+ React Router 2
+ Auth0 Lock 10

## Testing
Mocha, mochawesome, mockgoose, supertest and should are used together to test the REST API.

Mockgoose is used for mocking a Mongo DB.
Tests can be seen in the test directiory in the root of the project.
The testConfig.json specifies the Username and Password to be used with the REST API.

testDirections.js tests all the functionality associated with directions including search directions via a paramater query (?user_id=2343).
testUserPreferences.js tests all the functionality associated with UserPreferences including obtaining model via user_id and adding + retriving locations associated with a UserPreference.

Note there are 3 models, Direction, UserPreference and UserLocation. Each of which has its own custom validators which are tested within the test files.

Mochawesome is used for generating reports.

The tests can be ran via 'npm run test' and the result report can be found : simple-route-mongo/mochawesome-reports/mochawesome.html. There is also a JSON file if you want the test results in JSON.

## Data Model Design.

Overall the data model is quite simple. The User's preferences are stored in a user table with the user id being the key of the table. The user table contains all preferences mentioned in the profile as well as the username, email and authentication provider of the user.

The directions table is used to store the searched user directions, it contains a key pointing back to the user table and has the start address, end address and date searched.

![Data Model][dataModel]

Example Entry in User Table as is in Firebase :

{
	avoidHighways: false,
	avoidTolls: false,
	email: "colmcarew2@gmail.com",
	provider: "google-oauth2",
	travelMode: "DRIVING",
	unitSystem: "METRIC",
	username: "Colm C"
}

Example Entry in the Directions Table as is in Firebase :

{
	date_searched: "2017-03-20T22:29:51.558Z",
	end_address: "Dublin Airport, Dublin, Ireland",
	start_address: "Wexford",
	user_id: "google-oauth2|XXXXXXXX"
}

Again this is very basic data. A nice feature for furture development would be to store saftey information regarding neighbourhoods and areas such that the user could opt to get directions the safest way possible. Ideally the user would also be able to add data into safety information saying whether a neighbourhood was safe or not. Another nice feature would be to track the user's location and store them in a seperate table so the user would be able to see where they have been and also if anyone was using their account when they should not have been.

## App Component Design.

## UI Design.

## Routing.
+ /login - login page
+ /about - about page
+ /home - home page of app - the Map
+ /home/directions/:fromLocation/:toLocation - Paramaterised URL, (:fromLocation) is the starting address and (:toLocation) is the end address - returns a Map with directions based on the user's preferences
+ /profile - logged in user's profile
+ /logout - logout of app and directed back to login back
+ Anything else results in the not found page

## Extra features
 

## Independent learning.



[dataModel]: ./readmeResources/SimpleRouteReactDataModel.png