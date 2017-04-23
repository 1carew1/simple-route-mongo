import RestService from './RestService';

const userPreferences = "userPreferences/";
const directionsUrl = "directions/";
const restService = new RestService();

export default class BackendDatabaseService {
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
        restService.postToBackend(userPreferences, newUserPrefObjs, functionToRunOnCompletion);
    }

    // Update the users travel preference i.e. walk, car, etc
    updateUserTravelMode(userId, travelMode) {
        const updateObj = {
            travel_mode: travelMode
        };
        restService.putToBackend(userPreferences, userId, updateObj);
    }

    // Update the users units - metric or imperial
    updateUserUnits(userId, unit) {
        const updateObj = {
            unit_system: unit
        };
        restService.putToBackend(userPreferences, userId, updateObj);
    }

    // Update the user avoid motorway
    updateUserAvoidMotorway(userId, avoid) {
        const updateObj = {
            avoid_highways: avoid
        };
        restService.putToBackend(userPreferences, userId, updateObj);
    }

    // Update the user avoid tolls
    updateUserAvoidTolls(userId, avoid) {
        const updateObj = {
            avoid_tolls: avoid
        };
        restService.putToBackend(userPreferences, userId, updateObj);
    }


    // Read User Data
    readUserData(profile) {
        if (profile) {
            const createUserInfo = this.writeUserData.bind(this);
            const functionToRunOnCompletion = (response) => {
                if (response && response.user_id) {
                    // Do Nothing All Good
                } else {
                    // Create It
                    console.log('Need to create User Preferences');
                    createUserInfo(profile);
                }
            };
            restService.getFromBackend(userPreferences, profile.user_id, functionToRunOnCompletion);
        }
    }

    readUserDataAndExecuteFunction(profile, incomingFunction) {
        if (profile) {
            restService.getFromBackend(userPreferences, profile.user_id, incomingFunction);
        }
    }

    storeDirectionsInDB(profile, directions) {
        if (profile && directions) {
            let directionsObject = directions.routes[0].legs[0];
            let objectDirectionsToPush = {};

            objectDirectionsToPush.user_id = profile.user_id;
            objectDirectionsToPush.date_searched = new Date();
            objectDirectionsToPush.start_address = directionsObject.start_address;
            objectDirectionsToPush.end_address = directionsObject.end_address;
            restService.postToBackend(directionsUrl, objectDirectionsToPush);
        }
    }

    retrieveLastXDirectionsOfUser(profile, numberOfEntries, functionToRunOnCompletion) {
        if (profile && numberOfEntries) {
            let url = directionsUrl;
            url = url.replace("/", "");
            url += "?limit=" + numberOfEntries;
            url += "user_id=" + profile.user_id;
            restService.getFromBackend(url, null, functionToRunOnCompletion);
        }
    }

}
