import supertest from "supertest";
import {server} from  "../server.js";
import should from "should";
// UNIT test begin
describe("Directions API unit test",function(){
this.timeout(120000);//increase timeout of tests to 2 mins. Starting Mockgoose can take time.
// #1 return a collection of json documents
it("should return collection of JSON documents",function(done){
  // calling home page api
  supertest(server)
  .get("/api/v1/directions")
  .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
  .expect("Content-type",/json/)
  .expect(200) // This is the HTTP response
  .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      done();
  });
});


// #2 add a contact
it("should add a direction",function(done){
// post to /api/contacts
// calling home page api
supertest(server)
.post("/api/v1/directions")
.set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
.send({"end_address" : "12 Real Street", "start_address" : "49 Fake Street", "user_id" : "132323_234234234"})
.expect("Content-type",/json/)
.expect(201)
.end(function(err,res){
  res.status.should.equal(201);
  res.body.direction.should.have.property('_id');
  res.body.direction.should.have.property('date_searched');
  res.body.direction.end_address.should.equal('12 Real Street');
  done();
});
});



//#3
it("should update direction",function(done){
// put to /api/v1/directions
// calling home page api
const superserver = supertest(server);
superserver
.get("/api/v1/directions")
.set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
.expect("Content-type",/json/)
.expect(200) // THis is HTTP response
.end(function(err,res){
    const id = res.body[0]._id;
    superserver
        .put("/api/v1/directions/"+id)
        .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
        .send({"end_address" : "12 Real Street", "start_address" : "492 Fake Street", "user_id" : "132323_234234234"})
        .expect("Content-type",/json/)
        .end(function(err,res){
            res.body._id.should.equal(id);
            res.body.start_address.should.equal('492 Fake Street');
            done();
         }
       );
       }
     );
});

//#4
it("should get specific direction",function(done){
// put to /api/v1/directions
// calling home page api
const superserver = supertest(server);
superserver
.get("/api/v1/directions")
.set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
.expect("Content-type",/json/)
.expect(200) // THis is HTTP response
.end(function(err,res){
    const id = res.body[0]._id;
    superserver
        .get("/api/v1/directions/"+id)
        .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
            res.body._id.should.equal(id);
            done();
         }
       );
       }
     );
});


//#5
it("should delete direction",function(done){

const superserver = supertest(server);
superserver
.get("/api/v1/directions")
.set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
.expect("Content-type",/json/)
.expect(200) // THis is HTTP response
.end(function(err,res){
    const id = res.body[0]._id;
    superserver
        .delete("/api/v1/directions/"+id)
        .set('Authorization', 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=')
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
            res.body._id.should.equal(id);
            res.body.should.have.property("date_searched");
            done();
         }
       );
       }
     );
});

});