const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  login_id: { type: mongoose.Types.ObjectId, ref: 'login_tb' },
  restaurant_id: { type: mongoose.Types.ObjectId, ref: 'restaurant_tb' },
  orphanage_id: [
    {
      orphanage: { type: mongoose.Types.ObjectId, ref: 'orphanage_tb' },
      donated: { type: String },
      status:{type:Number},
      date: {
        type: Date,
        default: Date.now,
      },      
    }
  ],
  food_type: { type: String, require: true },
  quantity: { type: String, require: true },
  quantity_donated: { type: String },
  status: { type: String, require: true },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

var donationData = mongoose.model('donation_tb', donationSchema);

module.exports = donationData;