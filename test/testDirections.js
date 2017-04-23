import supertest from "supertest";
import { server } from "../server.js";
import should from "should";

import backendConfig from './testConfig.json';
// Basic Auth Details
const basicAuth = "Basic " + new Buffer(backendConfig.username.trim() + ":" + backendConfig.password.trim()).toString('base64');

// UNIT test begin
describe("Directions API unit test", function() {
    this.timeout(120000); //increase timeout of tests to 2 mins. Starting Mockgoose can take time.
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
            .get("/api/v1/directions")
            .set('Authorization', basicAuth)
            .expect("Content-type", /json/)
            .expect(200) // This is the HTTP response
            .end(function(err, res) {
                // HTTP status should be 200
                res.status.should.equal(200);
                done();
            });
    });


    // #2 add a contact
    it("should add a direction", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "end_address": "12 Real Street", "start_address": "49 Fake Street", "user_id": "132323_234234234" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                res.body.direction.should.have.property('_id');
                res.body.direction.should.have.property('date_searched');
                res.body.direction.end_address.should.equal('12 Real Street');
                done();
            });
    });



    //#3
    it("should update direction", function(done) {
        const superserver = supertest(server);
        superserver
            .get("/api/v1/directions")
            .set('Authorization', basicAuth)
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function(err, res) {
                const id = res.body[0]._id;
                superserver
                    .put("/api/v1/directions/" + id)
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .send({ "end_address": "12 Real Street", "start_address": "492 Fake Street", "user_id": "132323_234234234" })
                    .expect("Content-type", /json/)
                    .end(function(err, res) {
                        res.body._id.should.equal(id);
                        res.body.start_address.should.equal('492 Fake Street');
                        done();
                    });
            });
    });

    //#4
    it("should get specific direction", function(done) {
        const superserver = supertest(server);
        superserver
            .get("/api/v1/directions")
            .set('Authorization', basicAuth)
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function(err, res) {
                const id = res.body[0]._id;
                superserver
                    .get("/api/v1/directions/" + id)
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect("Content-type", /json/)
                    .expect(200) // THis is HTTP response
                    .end(function(err, res) {
                        res.body._id.should.equal(id);
                        done();
                    });
            });
    });


    //#5
    it("should delete direction", function(done) {

        const superserver = supertest(server);
        superserver
            .get("/api/v1/directions")
            .set('Authorization', basicAuth)
            .expect("Content-type", /json/)
            .expect(200) // THis is HTTP response
            .end(function(err, res) {
                const id = res.body[0]._id;
                superserver
                    .delete("/api/v1/directions/" + id)
                    .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
                    .expect("Content-type", /json/)
                    .expect(200) // THis is HTTP response
                    .end(function(err, res) {
                        res.body._id.should.equal(id);
                        res.body.should.have.property("date_searched");
                        done();
                    });
            });
    });

    //#6
    it("Cannot add direction with blank start address", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "end_address": "12 Real Street", "user_id": "132323_234234234" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    //#7
    it("Cannot add direction with blank end address", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "start_address": "12 Real Street", "user_id": "132323_234234234" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    //#8
    it("Cannot add direction with blank user", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "start_address": "12 Real Street", "end_address": "12 Real Street" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    //#9
    it("Start Address should be greater than 5 characters", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "start_address": "12", "end_address": "12 Real Street", "user_id": "1234567543524" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    //#10
    it("End Address should be greater than 5 characters", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "start_address": "123 Fark Street", "end_address": "12", "user_id": "1234567543524" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    //#11
    it("User Id should be greater than 5 characters", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "start_address": "123 Fark Street", "end_address": "123 Real Street", "user_id": "12" })
            .expect("Content-type", /json/)
            .expect(500)
            .end(function(err, res) {
                res.status.should.equal(500);
                done();
            });
    });

    //#12
    it("Date search should Default to a date", function(done) {
        supertest(server)
            .post("/api/v1/directions")
            .set('Authorization', basicAuth)
            .send({ "start_address": "123 Fark Street", "end_address": "123 Real Street", "user_id": "12543453454335", "date_searched": "1234" })
            .expect("Content-type", /json/)
            .expect(201)
            .end(function(err, res) {
                res.status.should.equal(201);
                res.body.direction.should.have.property("date_searched");
                const regex = new RegExp("^\\d{4}\\-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d+Z$");
                should(regex.test(res.body.direction)).be.ok;
                done();
            });
    });

});
