import mongoose from 'mongoose';

const DirectionsSchema = new mongoose.Schema({
  start_address: { type: String, required: true },
  end_address: { type: String, required: true },
  user_id: { type: String, required: true },
  date_searched: { type: Date, default: Date.now, required: true }
});

const stringLengthValidator = (v) => {
	let result = false;
    if(v.length > 5){
        result = true;
    }
    return result;
};

DirectionsSchema.path('start_address').validate(stringLengthValidator);
DirectionsSchema.path('end_address').validate(stringLengthValidator);
DirectionsSchema.path('user_id').validate(stringLengthValidator);

export default mongoose.model('directions', DirectionsSchema);