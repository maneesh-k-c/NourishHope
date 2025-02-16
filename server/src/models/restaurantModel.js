const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  login_id: { type: mongoose.Types.ObjectId, ref: 'login_tb' },
  restaurant_name: { type: String, require: true },
  mobile: { type: String, require: true },
  email: { type: String, require: true },
  description: { type: String},
  rating: [
      {
        userId: { type: mongoose.Types.ObjectId, ref: 'login_tb' },
        value: { type: Number },
      }
    ],
  address: { type: String, require: true },
  upi: { type: String, require: true },
  restaurant_images: { type: [String], require: true },

});

var restaurantData = mongoose.model('restaurant_tb', restaurantSchema);

module.exports = restaurantData;