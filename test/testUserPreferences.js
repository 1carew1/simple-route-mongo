import supertest from "supertest";
import { server } from "../server.js";
import should from "should";
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import config from '../config';

import backendConfig from './testConfig.json';
// Basic Auth Details
const basicAuth = "Basic " + new Buffer(backendConfig.username.trim() + ":" + backendConfig.password.trim()).toString('base64');

// UNIT test begin
describe("User Preferences API unit test", function() {
    this.timeout(120000); //increase timeout of tests to 2 mins. Starting Mockgoose can take time.

    // Drop the database before each test
    before(function(done) {
        const mockgoose = new Mockgoose(mongoose);
        mockgoose.prepareStorage().then(() => {
            mongoose.connect(config.mongoDb);
        });
        mongoose.connect('mongodb://localhost/test', function() {
            mongoose.connection.db.dropDatabase(() => {
                done();
            })
        })
    })


    // #0 Cannot do anything via Rest without Basic Auth
    it("Cannot do anything via Rest without Basic Auth", function(done) {
        supertest(server)
            .get("/api/v1/directions")
            .expect("Content-type", /json/)
            .expect(401) // This is the HTTP response
            .end(function(err, res) {
                // HTTP status should be 401
                res.status.should.equal(401);
                done();
            });
    });

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
    it("user email should be unique", function(done) {
        const url = "/api/v1/userPreferences";
        supertest(server)
            .post(url)
            .set('Authorization', basicAuth)
            .send({ username: "usfffername", user_id: "123fff45", email: "cc2@cc.cc", provider: "test" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                res.body.userPreference.should.have.property('_id');
                res.body.userPreference.email.should.equal('cc2@cc.cc');
                supertest(server)
                    .post(url)
                    .set('Authorization', basicAuth)
                    .send({ username: "usernxxxame", user_id: "123xx45", email: "cc2@cc.cc", provider: "test" })
                    .expect("Content-type", /json/)
                    .expect(500)
                    .end(function(err, res) {
                        res.status.should.equal(500);
                        done();
                    });
            });
    });

    // #4 add a user name should be unique
    it("username should be unique", function(done) {
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
                    .expect(500)
                    .end(function(err, res) {
                        res.status.should.equal(500);
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
    it("should add a User Preference", function(done) {
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

    // #7 A location should have a correctly formatted lattitude
    it("should add a User Preference", function(done) {
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
                    .send({ lat: 'abvdfre', lng: -7.234534 })
                    .expect("Content-type", /json/)
                    .expect(500)
                    .end(function(err, res) {
                        res.status.should.equal(500);
                        done();
                    });
            });
    });

});
