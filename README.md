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

## Installation requirements
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
Overall each model is quite heavily tested. As of writing this there are 32 tests.

Mochawesome is used for generating reports.

![Data Model][directionsTest]

Some of the Directions test results as per the Mochawesome reporting test tool. Note the long delay in setting up the Mockgoose database.

One point to note about testing is that a beforeEach function was written to clear the database, however this heavily degraded the time performance of running the tests.

![Data Model][userTests]

Some of the User test results as per the Mochawesome reporting test tool.

The tests can be ran via 'npm run test' and the result report can be found : simple-route-mongo/mochawesome-reports/mochawesome.html. There is also a JSON file if you want the test results in JSON.

## Data Model Design

Overall the data model is quite simple. The User's preferences are stored in a user_preferences collection. The user_preferences collection contains all preferences mentioned in the profile as well as the username, email and authentication provider of the user. It also contains all of the visted locations which is its own mongoose model.

The directions collection is used to store the searched user directions, it contains a user_id key pointing back to the user_preferences collection and has the start address, end address and date searched.

![Data Model][dataModel]

Example Entry in user_preferences :

{
	avoid_highways: false,
	user_id: "google-oauth2|XXXXXXXX",
	avoid_tolls: false,
	email: "colmcarew2@gmail.com",
	provider: "google-oauth2",
	travel_mode: "DRIVING",
	unit_system: "METRIC",
	username: "Colm C",
	locations : []
}

Example Entry in the directions :

{
	date_searched: "2017-03-20T22:29:51.558Z",
	end_address: "Dublin Airport, Dublin, Ireland",
	start_address: "Wexford",
	user_id: "google-oauth2|XXXXXXXX"
}

A nice feature for furture development would be to store saftey information regarding neighbourhoods and areas such that the user could opt to get directions the safest way possible. Ideally the user would also be able to add data into safety information saying whether a neighbourhood was safe or not.

The model may be simple in design but it is heavily tested + validated and works well with the React Frontend.

## API Routing
### User Preferences
+ GET /api/v1/userPreferences - get all user preferences
+ GET /api/v1/userPreferences/user_id - get user preference of specific user - this is their Auth0 profile id, not the Mongo DB _id
+ PUT /api/v1/userPreferences/user_id - update a user preference with the sent body - must pass validation
+ POST /api/v1/userPreferences - create a user preference with the given body - must pass validation
+ DELETE /api/v1/userPreferences/id - Delete a user preference using the Mogo DB _id value - this is not used via the Frontend but was useful to have and it is tested
+ GET /api/v1/userPreferences/user_id/locations - get all locations of a specific user
+ POST /api/v1/userPreferences/user_id/locations - create a user location - must pass validation

### Directions
+ GET /api/v1/directions - get all directions - there is also query functionality here which supports search by user id, start date and end date so a query may look like /api/v1/directions?user_id=1234&start_date=XXXX&end_date=XXX&limit=100 - Note that start date must have an end date but not all of these paramaters must be used, however if a limit is not specified it defaults to 100
+ GET /api/v1/directions/:id - get a specific direction
+ PUT /api/v1/directions/:id - update a direction - not actually used by the frontend but it is tested
+ POST /api/v1/directions - create a new directions - it must pass validation
+ DELETE /api/v1/directions/:id - delete a direction - not used by frontend but it is tested
## Extra features
### Basic Auth
express-basic-auth was used for basic HTTP Auth as a step in securing the REST API so that not just anyone would be able to perform requests.
There is a concern here however as the passwords do need to be stored in plain text and the Authorization HTTP header can be easily decoded (Base64). A follow on to this would be to use JSON web tokens such that they expire after a certain time. User Roles should also be set up such that a front end can only post and get, not delete for instance, if that is desired.


### Docker
The project contains a docker-compose.yml file and Dockerfile. These are used for generating the appropriate Docker Images + connecting them in order to get the applications running. This eliminates the need for the user to run Mongo themselves. There are 3 images, dhermanns/rpi-mongo - Mongo DB for Raspberry Pi, tianon/true - Data storage for Mongo and hypriot/rpi-node. Note in most cases a specific version of the Dokcer image was used as it can be dangerous to always pull the latest.

Obviously these images are not standard Docker images. Some of them are build in mind for a Raspberry Pi architecture. They were picked for this reason. The App is capable of running via Docker, on a Raspberry Pi, it can also run on anything that runs Docker as 64 bit standard Docker images will not run on the Pi. In this case it was deployed live to a Raspberry Pi 3.


## Independent learning
### Docker
As mentioned above Docker is used for running the App as it eliminates the 'it runs on my machine' issues. For this project Docker images were chosed for the Raspberry Pi, as even though all Docker images should run on any Docker daemon, they do not if the architecture cannot support the underlying image. However as the images are built for the Raspberry Pi, the images should now run on any machine as a 64 bit machine can run 32 bit images but not vice versa. Fun fact, the Raspberry Pi 3 is actually 64 bit, however the Raspbian image is 32 bit for backwards compatability with older Pis.
### Jenkins
A Jenkins build server was also deployed on the Raspberry Pi, however there is a slight issue. npm run test cannot be run on the Raspberry Pi even though npm has an build for ARM. The reason is that the Mongo and Mongoose modules will not run when testing the app, thus the App cannot be tested and thus the Pi cannot be used to build the App as it cannot test the code as it will always fail.

The solution implemented for this was that a Jenkins Server was ran on a local machine (Mac) which listened via Git HTTP Hooks for code changes, once a change would come in the project would be built and deployed to the Pi and the Pi would run the App via Docker.

A better solution to this would be to run Jenkins on the Pi as a slave to the Jenkins running locally. Once the master Jenkins built project is sucessful, get the Pi to build the project (note build, not test) and deploy it.



[dataModel]: ./readmeResources/SimpleRouteReactDataModel.png
[userTests]: ./readmeResources/userTests.png
[directionsTest]: ./readmeResources/directionsTest.png