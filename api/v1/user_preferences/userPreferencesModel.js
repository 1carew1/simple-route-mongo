import mongoose from 'mongoose';
import _ from 'lodash';
import uniqueValidator from 'mongoose-unique-validator';

const UserLocationSchema = new mongoose.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    date: { type: Date, default: Date.now, required: true }
});

const latLngValidator = (v) => {
    const regex = new RegExp("^\\-?\\d+\\.?\\d*$");
    return regex.test(v.toString());
}

UserLocationSchema.path('lat').validate(latLngValidator);
UserLocationSchema.path('lng').validate(latLngValidator);

const UserPreferenceSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    avoid_highways: { type: Boolean, default: false },
    avoid_tolls: { type: Boolean, default: false },
    user_id: { type: String, required: true, unique: true },
    email: { type: String, required: false, unique: true },
    provider: { type: String, required: true },
    travel_mode: { type: String, default: 'DRIVING' },
    unit_system: { type: String, default: 'METRIC' },
    locations: [UserLocationSchema]
});
UserPreferenceSchema.plugin(uniqueValidator);


const allowedTravelModes = ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'];
const allowedUnits = ['IMPERIAL', 'METRIC'];

const travelModeValidator = (v) => {
    return _.includes(allowedTravelModes, v);
};

const unitValidator = (v) => {
    return _.includes(allowedUnits, v);
};

const emailValidator = (v) => {
    const regex = new RegExp("^.+?@.+?\\..+$");
    return regex.test(v);
};

UserPreferenceSchema.path('unit_system').validate(unitValidator);
UserPreferenceSchema.path('travel_mode').validate(travelModeValidator);
UserPreferenceSchema.path('email').validate(emailValidator);

export default mongoose.model('user_preferences', UserPreferenceSchema);
