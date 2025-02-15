const mongoose = require('mongoose');

const orphanageSchema = new mongoose.Schema({
  login_id: { type: mongoose.Types.ObjectId, ref: 'login_tb' },
  orphanage_name: { type: String, require: true },
  email: { type: String, require: true },
  description: { type: String},
  mobile: { type: String, require: true },
  upi: { type: String},
  address: { type: String, require: true },
  orphanage_images: { type: [String], require: true },
});

var orphanageData = mongoose.model('orphanage_tb', orphanageSchema);

module.exports = orphanageData;