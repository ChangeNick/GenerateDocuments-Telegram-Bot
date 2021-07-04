const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
  telegramUserId: {type: Number, required: true},
  categoryOfCompany: {type: String, required: true},
  companyName: {type: String},
  profession: {type: String},
  fullName: {type: String},
  charter: {type: String}
})

module.exports = model('User', UserSchema);
