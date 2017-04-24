import superagent from 'superagent';
import backendConfig from '../../config/backendConfig.json';
// For testing for now, change to just be /api
const apiUrl = "/api/";
const apiVersion = "v1/";
//  Get Basic Auth String - Base 64
const basicAuth = "Basic " + btoa(backendConfig.username.trim() + ":" + backendConfig.password.trim());
export default class RestService {
	constructor(){
		
	}
    postToBackend(urlItem, itemToPost, functionToRunOnCompletion) {
        superagent
            .post(apiUrl + apiVersion + urlItem)
            .send(itemToPost)
            .set('Accept', 'text/json')
            .set('Authorization', basicAuth)
            .end((error, response) => {
                if (error) {
                    console.log('Error Posting to backend');
                    console.log(itemToPost);
                    console.log(error);
                } else {
                    if (functionToRunOnCompletion != null) {
                        functionToRunOnCompletion(response.body);
                    }
                }
            });
    }

    putToBackend(urlItem, id, itemToPut, functionToRunOnCompletion) {
        superagent
            .put(apiUrl + apiVersion + urlItem + id)
            .send(itemToPut)
            .set('Accept', 'text/json')
            .set('Authorization', basicAuth)
            .end((error, response) => {
                if (error) {
                    console.log('Error Putting to backend');
                    console.log(itemToPut);
                    console.log(error);
                } else {
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
                    if (functionToRunOnCompletion != null) {
                        functionToRunOnCompletion(response.body);
                    }
                }
            });
    }

    deleteFromBackend(urlItem, id, functionToRunOnCompletion) {
        if (id) {
            const urlToDelete = apiUrl + apiVersion + urlItem + id;
            superagent
                .delete(urlToDelete)
                .set('Accept', 'text/json')
                .set('Authorization', basicAuth)
                .end((error, response) => {
                    if (error) {
                        console.log('Error Deleting from backend');
                        console.log(error);
                    } else {
                        if (functionToRunOnCompletion != null) {
                            functionToRunOnCompletion(response.body);
                        }
                    }
                });
        } else {
            console.log('Id is null so not going to delete anything');
        }

    }
}
