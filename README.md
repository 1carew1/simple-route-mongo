# Enterprise Web Development Assignment 2 - Node, Express, MongoDB and ReactJS app.

Name: Colm Carew

## Overview
Simple Route is a Web Application written using the React JavaScript Library, the original project of which can be found here : https://github.com/1carew1/simple-route. 

The core idea of the application is to create a Mongo + Express backend using Node JS in order to convey good design practice for APIs.


### Feature List
  
 + Centring the map on the user's current location + placing a marker
 + Flying to a location/address specified by the user and placing a marker there
 + Directions from one location to another giving the simplest route obtained from Google Direction Services (simplest is defined by the lowest number of turns)
 + Storing the user's preferences such that the user can pick the units (Imperial or Metric), the mode of transport (Car, Walk etc.), the option of avoiding tolls and the option of avoiding motorways/highways
 + Storing of the user's searched directions and displaying the most recent 10 searched in descending order of recency (most recent first) and providing a link to generate the directions again
 + A paramaterised URL which allows the user to share their searched directions

## Installation requirements.
Please see the file SimpleRouteEntWebDev.pdf in the root of this project for more information of its functionality and how to set it up.

Ensure you have a firebaseConfig.json file in the config folder of this project with following content using your own Keys + Links :

{
    "apiKey": "XXXXXXX",
    "authDomain": "XXXXXXX",
    "databaseURL": "XXXXXXX",
    "storageBucket": "XXXXXXX",
    "messagingSenderId": "XXXXXXX"
}

Ensure you have a googleMapsAPIKey.json file in the config folder  of this project with the following content :

{
  "apiKey" : "XXXXX"
}

- Side note - index.html, which is located in the public folder, the API key will need to be changed here as there was no way around having the Google Maps JS script with the API Key in this file.


Ensure you have a  auth0Config.json file in the config folder  of this project with following content using your own Keys + Links :

{
  "apiKey": "XXXXX",
  "userUrl": "XXXXX"
}

Once completed run 'npm install' in the root of the project.
Once all packages are installed run 'npm start'

### List of Software + Technologies Used
+ Node 6.10.0
+ npm 3.10.10
+ create-react-app tool
+ ReactJS v15.4.2
+ Bootstrap 3
+ React Google Maps 6
+ Superagent 3
+ React Select 1
+ React Router 2
+ Firebase 3
+ Auth0 Lock 10

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
[homeModel]: ./readmeResources/SimpleRouteReactHomeModel.png
[mainModel]: ./readmeResources/SimpleRouteReactMainModel.png
[profileModel]: ./readmeResources/SimpleRouteReactProfileModel.png
[homeScreenMap]: ./readmeResources/homeScreenMap.png
[loginMenu]: ./readmeResources/loginMenu.png
[loginScreen]: ./readmeResources/loginScreen.png
[profileBasicInfo]: ./readmeResources/profileBasicInfo.png
[mapWithDirections]: ./readmeResources/mapWithDirections.png
[flyToLocation]: ./readmeResources/flyToLocation.png
[directionsForm]: ./readmeResources/getDirectionForm.png
[aboutPage]: ./readmeResources/aboutPage.png
[directionsTable]: ./readmeResources/directionTable.png
[preferences]: ./readmeResources/preferences.png