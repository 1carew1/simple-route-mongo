import mongoose from 'mongoose';

const DirectionsSchema = new mongoose.Schema({
  start_address: { type: String, required: true },
  end_address: { type: String, required: true },
  user_id: { type: String, required: true },
  date_searched: { type: Date, default: Date.now, required: true }
});

const addressValidator = (v) => {
	let result = false;
    if(v.length > 5){
        result = true;
    }
    return result;
};

const dateValidator = (v) => {
	let result = false;
	if(v instanceof Date ) {
		result = true;
	}
	return result;
};

DirectionsSchema.path('start_address').validate(addressValidator);
DirectionsSchema.path('end_address').validate(addressValidator);
DirectionsSchema.path('date_searched').validate(dateValidator);
DirectionsSchema.path('user_id').validate(addressValidator);

export default mongoose.model('directions', DirectionsSchema);