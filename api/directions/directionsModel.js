const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const SirectionsSchema = new Schema({
  start_address: String,
  end_address: String,
  user_id: String,
  date_searched: { type: Date, default: Date.now }
});


export default mongoose.model('directions', SirectionsSchema);