import supertest from "supertest";
import { server } from "../app.js";
import should from "should";
import backendConfig from './testConfig.json';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
let mockgoose = new Mockgoose(mongoose);

// Basic Auth Details
const basicAuth = "Basic " + new Buffer(backendConfig.username.trim() + ":" + backendConfig.password.trim()).toString('base64');

// Drop the database before each test
// before(function(done) {
//     this.timeout(10000);
//     mockgoose.prepareStorage().then(function() {
//         mongoose.connect('mongodb://localhost:27017/test', function(err) {
//             console.log('Clearing DB');
//             done(err);
//         });
//     });
// });

// UNIT test begin
describe("User Preferences API + Schema unit tests", function() {
    this.timeout(120000); //increase timeout of tests to 2 mins. Starting Mockgoose can take time.

    // #1 return a collection of json documents
    it("should return collection of JSON documents", function(done) {
        supertest(server)
            .get("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .expect("Content-type", /json/)
            .expect(200) // This is the HTTP response
            .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                done();
            });
    });


    // #2 add a userpreference
    it("should add a User Preference", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "username", user_id: "12345", email: "cc@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                res.body.userPreference.should.have.property('_id');
                res.body.userPreference.email.should.equal('cc@cc.cc');
                done();
            });
    });

    // #3 add a user email should be unique
    it("user email can be blank", function(done) {
        const url = "/api/v1/userPreferences";
        supertest(server)
            .post(url)
            .set('Authorization', basicAuth)
            .send({ username: "usfffername", user_id: "123fff45", email: "", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                res.body.userPreference.should.have.property('_id');
                res.body.userPreference.email.should.equal('');
                done();
            });
    });

    // #4 add a user name should be unique
    it("username should does not need to be unique", function(done) {
        const url = "/api/v1/userPreferences";
        supertest(server)
            .post(url)
            .set('Authorization', basicAuth)
            .send({ username: "testusername", user_id: "1234567890", email: "colmtest@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                res.body.userPreference.should.have.property('_id');
                supertest(server)
                    .post(url)
                    .set('Authorization', basicAuth)
                    .send({ username: "testusername", user_id: "123xxrere45", email: "cc2cvvc@cc.cc", provider: "test" })
                    .expect("Content-type", /json/)
                    .expect(201)
                    .end(function(err, res) {
                        res.status.should.equal(201);
                        res.body.userPreference.username.should.equal("testusername");
                        done();
                    });
            });
    });

    // #5 user id should be unique
    it("user_id should be unique", function(done) {
        const url = "/api/v1/userPreferences";
        supertest(server)
            .post(url)
            .set('Authorization', basicAuth)
            .send({ username: "RandonUserName", user_id: "test123", email: "antoherTest@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                res.body.userPreference.should.have.property('_id');
                supertest(server)
                    .post(url)
                    .set('Authorization', basicAuth)
                    .send({ username: "testusername", user_id: "test123", email: "cc2cv323vc@cc.cc", provider: "test" })
                    .expect("Content-type", /json/)
                    .expect(500)
                    .end(function(err, res) {
                        res.status.should.equal(500);
                        done();
                    });
            });
    });

    // #6 add a location to user preference
    it("add a location to user preference", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "username2", user_id: "123452", email: "2cc@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                const userPreference = res.body.userPreference;
                userPreference.should.have.property('_id');
                userPreference.email.should.equal('2cc@cc.cc');
                supertest(server)
                    .post("/api/v1/userPreferences/" + userPreference.user_id + "/locations")
                    .set('Authorization', basicAuth)
                    .send({ lat: 54.5645654, lng: -7.234534 })
                    .expect("Content-type", /json/)
                    .expect(201)
                    .end(function(err, res) {
                        res.status.should.equal(201);
                        const location = res.body;
                        location.should.have.property('_id');
                        location.lat.should.equal(54.5645654);
                        location.lng.should.equal(-7.234534);
                        done();
                    });
            });
    });

    // #7 A location should have a correctly formatted latitude
    it("A location should have a correctly formatted latitude", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "username2343", user_id: "123432432452", email: "3243242cc@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                const userPreference = res.body.userPreference;
                userPreference.should.have.property('_id');
                supertest(server)
                    .post("/api/v1/userPreferences/" + userPreference.user_id + "/locations")
                    .set('Authorization', basicAuth)
                    .send({ lat: 'abvdfre', lng: -7.234534 })
                    .expect("Content-type", /json/)
                    .expect(500)
                    .end(function(err, res) {
                        res.status.should.equal(500);
                        done();
                    });
            });
    });

    // #8
    it("A location should have a correctly formatted longitude", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "use34rname2343", user_id: "1232432452", email: "32442cc@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                const userPreference = res.body.userPreference;
                userPreference.should.have.property('_id');
                supertest(server)
                    .post("/api/v1/userPreferences/" + userPreference.user_id + "/locations")
                    .set('Authorization', basicAuth)
                    .send({ lat: 52.34534, lng: 'abvdfre' })
                    .expect("Content-type", /json/)
                    .expect(500)
                    .end(function(err, res) {
                        res.status.should.equal(500);
                        done();
                    });
            });
    });

    // #9
    it("An email should be formatted correctly", function(done) {

        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "ANewUserName", user_id: "ANewUserId", email: "aBadEmail", provider: "test" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    // #10
    it("User preference needs a username", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ user_id: "ANewUserId", email: "cc34343456@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    // #11
    it("User preference needs a user id", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "ANewUserId", email: "cc34343456@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    // #12
    it("Travel Mode Must be in Given List", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "ANewUse5435443rId", user_id: "ANewUserIDDD", email: "cc34343456@cc.cc", provider: "test", travel_mode: "Invalid" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.body.name.should.equal('ValidationError');
                res.status.should.equal(500);
                done();
            });
    });

    // #13
    it("Unit System Must be within a given list", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "ANewUse5435443rId", user_id: "ANewUserIDDD", email: "cc34343456@cc.cc", provider: "test", unit_system: "Invalid" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.body.name.should.equal('ValidationError');
                res.status.should.equal(500);
                done();
            });
    });

    // #14
    it("Obtain User Preference By User Id - Not DB _id", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "newUserForTest14", user_id: "newUserForTest14", email: "newUserForTest14@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                supertest(server)
                    .get("/api/v1/userPreferences/" + res.body.userPreference.user_id)
                    .set('Authorization', basicAuth)
                    .expect("Content-type", /json/)
                    .expect(200)
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.have.property('_id');
                        done();
                    });
            });
    });

    // #15
    it("Updating a User Preference", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "newUserForTest15", user_id: "newUserForTest15", email: "newUserForTest15@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                supertest(server)
                    .put("/api/v1/userPreferences/" + res.body.userPreference.user_id)
                    .set('Authorization', basicAuth)
                    .send({ travel_mode: 'WALKING' })
                    .expect("Content-type", /json/)
                    .expect(200)
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.have.property('_id');
                        res.body.travel_mode.should.equal('WALKING');
                        done();
                    });
            });
    });

    // #16
    it("Obtaining a List of locations", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "newUserForTest16", user_id: "newUserForTest16", email: "newUserForTest16@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                const userPreference = res.body.userPreference;
                userPreference.should.have.property('_id');
                supertest(server)
                    .post("/api/v1/userPreferences/" + userPreference.user_id + "/locations")
                    .set('Authorization', basicAuth)
                    .send({ lat: 54.5645654, lng: -7.234534 })
                    .expect("Content-type", /json/)
                    .expect(201)
                    .end(function(err, res) {
                        res.status.should.equal(201);
                        const location = res.body;
                        location.should.have.property('_id');
                        location.lat.should.equal(54.5645654);
                        location.lng.should.equal(-7.234534);
                        supertest(server)
                            .get("/api/v1/userPreferences/" + userPreference.user_id + "/locations")
                            .set('Authorization', basicAuth)
                            .expect("Content-type", /json/)
                            .expect(200)
                            .end(function(err, res) {
                                res.status.should.equal(200);
                                res.body.length.should.equal(1);
                                done();
                            });
                    });
            });

    });

    // #17
    it("Deleting a User Preference", function(done) {
        supertest(server)
            .post("/api/v1/userPreferences")
            .set('Authorization', basicAuth)
            .send({ username: "newUserForTest17", user_id: "newUserForTest17", email: "newUserForTest17@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                supertest(server)
                    .delete("/api/v1/userPreferences/" + res.body.userPreference._id)
                    .set('Authorization', basicAuth)
                    .expect("Content-type", /json/)
                    .expect(200)
                    .end(function(err, res) {
                        res.status.should.equal(200);
                        res.body.should.have.property('_id');
                        done();
                    });
            });
    });
});
