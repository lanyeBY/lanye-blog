const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userId: {
    type: String,
    require: true
  },
  userName: String,
  headImg: String,
  motto: String,
  friends: [],
  collects: [],
  postImg: String,
  interestItaps: [],
  addDate: String
}, { collection: 'user', versionKey: false});

module.exports = mongoose.model('user', UserSchema);
