import mongoose from 'mongoose';
import _ from 'lodash';

const UserPreferenceSchema = new mongoose.Schema({
  avoid_highways: { type: Boolean, default: false},
  avoid_tolls: { type: Boolean, default: false},
  user_id: { type: String, required: true },
  email: { type: String, required: false },
  provider : { type: String, required: true },
  travel_mode : { type: String, default: 'DRIVING'},
  unit_system :  {type: String, default: 'METRIC'}
});


const allowedTravelModes = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'];
const allowedUnits = ['IMPERIAL', 'METRIC'];

const travelModeValidator = (v) => {
    return _.includes(allowedTravelModes, v);
};

const unitValidator = (v) => {
    return _.includes(allowedUnits, v);
};

const emailValidator = (v) => {
  return v.matches(/.+?@.+?\..+/);
};

UserPreferenceSchema.path('unit_system').validate(unitValidator);
UserPreferenceSchema.path('travel_mode').validate(travelModeValidator);
UserPreferenceSchema.path('email').validate(travelModeValidator);

export default mongoose.model('user_preferences', UserPreferenceSchema);