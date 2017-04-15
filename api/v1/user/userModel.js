import mongoose from 'mongoose';
import mongooseRole from 'mongoose-role';
import _ from 'lodash';

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name : { type: String, required: true}
});


UserSchema.plugin(mongooseRole, {
  roles: ['public', 'user', 'admin'],
  accessLevels: {
    'public': ['public', 'user', 'admin'],
    'anon': ['public'],
    'user': ['user', 'admin'],
    'admin': ['admin']
  }
});

const emailValidator = (v) => {
  const regex = new RegExp("^.+?@.+?\\..+$");
  return regex.test(v);
};

UserSchema.path('email').validate(emailValidator);

export default mongoose.model('user', UserSchema);