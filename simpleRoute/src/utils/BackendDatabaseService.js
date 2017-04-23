import superagent from 'superagent';
import backendConfig from '../../config/backendConfig.json';

// For testing for now, change to just be /api
const apiUrl = "http://localhost:8090/api/";
const apiVersion = "v1/";
const userPreferences = "userPreferences/";
//  Get Basic Auth String - Base 64
const basicAuth = "Basic " + btoa(backendConfig.username.trim() + ":" + backendConfig.password.trim());

const database = null;
export default class BackendDatabaseService {
    postToBackend(urlItem, itemToPost, functionToRunOnCompletion) {
        superagent
            .post(apiUrl + apiVersion + urlItem)
            .send(itemToPost)
            .set('Accept', 'text/json')
            .set('Authorization', basicAuth)
            .end((error, response) => {
                if (error) {
                    console.log('Error Putting to backend');
                    console.log(error);
                } else {
                    console.log('Result from backend Post');
                    console.log(response.body);
                    if (functionToRunOnCompletion != null) {
                        functionToRunOnCompletion(response.body);
                    }
                }
            });
    }

    getFromBackend(urlItem, id, functionToRunOnCompletion) {
        let urlToGet = apiUrl + apiVersion + urlItem;
        if (id) {
            urlToGet += id;
        }
        superagent
            .get(urlToGet)
            .set('Accept', 'text/json')
            .set('Authorization', basicAuth)
            .end((error, response) => {
                if (error) {
                    console.log('Error Getting from backend');
                    console.log(error);
                } else {
                    console.log('Result from backend Get');
                    console.log(response.body);
                    if (functionToRunOnCompletion != null) {
                        functionToRunOnCompletion(response.body);
                    }
                }
            });
    }

    //Write Initial User
    writeUserData(profile, functionToRunOnCompletion) {
        let name = profile.name;
        if (!name) {
            name = '';
        }
        let email = profile.email;
        if (!email) {
            email = '';
        }
        let provider = null;
        if (profile.identities[0]) {
            provider = profile.identities[0].provider;;
        }
        if (!provider) {
            provider = 'unknown';
        }
        const newUserPrefObjs = {
            username: name,
            email: email,
            provider: provider,
            user_id: profile.user_id
        };
        const postToBackend = this.postToBackend.bind(this);
        postToBackend(userPreferences, newUserPrefObjs, functionToRunOnCompletion);
    }




    // Update the users travel preference i.e. walk, car, etc
    updateUserTravelMode(userId, travelMode) {
        database.ref('/user/' + userId).update({
            travelMode: travelMode
        });
    }

    // Update the users units - metric or imperial
    updateUserUnits(userId, unit) {
        database.ref('/user/' + userId).update({
            unitSystem: unit
        });
    }

    // Update the user avoid motorway
    updateUserAvoidMotorway(userId, avoid) {
        database.ref('/user/' + userId).update({
            avoidHighways: avoid
        });
    }

    // Update the user avoid tolls
    updateUserAvoidTolls(userId, avoid) {
        database.ref('/user/' + userId).update({
            avoidTolls: avoid
        });
    }


    // Read User Data
    readUserData(profile) {
        if (profile) {
            const createUserInfo = this.writeUserData.bind(this);
            const functionToRunOnCompletion = (response) => {
                if (response && response.user_id) {
                    // Do Nothing All Good
                    console.log('User Already Present');
                } else {
                    // Create It
                    console.log('Need to create User Preferences');
                    createUserInfo(profile);
                }
            };
            const getFromBackend = this.getFromBackend.bind(this);
            getFromBackend(userPreferences, profile.user_id, functionToRunOnCompletion);
        }
    }

    readUserDataAndExecuteFunction(profile, incomingFunction) {
        if (profile) {
            database.ref('/user/' + profile.user_id).once('value').then(function(snapshot) {
                if (snapshot && snapshot.val()) {
                    // Execture the parameter function with whatever the values returned are
                    incomingFunction(snapshot.val());
                }
            });
        }
    }

    storeDirectionsInDB(profile, directions) {
        if (profile && directions) {
            let directionsObject = directions.routes[0].legs[0];
            let objectDirectionsToPush = {};

            objectDirectionsToPush.user_id = profile.user_id;
            objectDirectionsToPush.date_searched = (new Date()).toISOString();
            objectDirectionsToPush.start_address = directionsObject.start_address;
            objectDirectionsToPush.end_address = directionsObject.end_address;
            let ref = database.ref('/directions/');
            ref.push(objectDirectionsToPush);
        }
    }

    retrieveLastXDirectionsOfUser(profile, numberOfEntries, functionToRunOnCompletion) {
        if (profile && numberOfEntries) {
            let dbRef = database.ref('/directions/');
            dbRef.orderByChild("user_id").equalTo(profile.user_id).limitToLast(numberOfEntries).once('value').then(function(snapshot) {
                let listOfResults = [];
                for (var value in snapshot.val()) {
                    if (snapshot.val().hasOwnProperty(value)) {
                        listOfResults.push(snapshot.val()[value]);
                    }
                }
                functionToRunOnCompletion(listOfResults);
            });

        }
    }

}
