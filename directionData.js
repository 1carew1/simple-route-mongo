import mongoose from 'mongoose';
import assert from 'assert';
import directionModel from './api/directions/directionsModel';
import config from './config';

const directions = [
  {
    "date_searched":"2013-10-21T13:28:06.419Z",
"end_address":
    "49 Clonard Park, Ballybeg, Waterford, X91 A47P",
"start_address":
    "UCC, Co. Cork, Ireland",
"user_id":
    "google-oauth2|105143597883641006112"

  },
  {
     "date_searched":"2013-10-21T13:28:06.419Z",
"end_address":
    "49 Clonard Park, Ballybeg, Waterford, X91 A47P",
"start_address":
    "DCU Dublin Ireland",
"user_id":
    "google-oauth2|105143597883641006112"

  }
];

export const loadDirections = () =>{directionModel.find({}).remove(function() {
    directionModel.collection.insert(directions, (err,docs)=>{
    if (err){
      console.log(`failed to Load Contact Data`);
    }
    else{
      console.info(`${directions.length} contacts were successfully stored.`);
    }
  })
});
}