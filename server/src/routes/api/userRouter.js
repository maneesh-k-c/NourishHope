const express = require('express');
const userData = require('../../models/userModel');
const loginData = require('../../models/loginModel');
const donationData = require('../../models/donationModel');
const { default: mongoose } = require('mongoose');
const requestData = require('../../models/requestModel');
const orphanageData = require('../../models/orphanageModel');
const restaurantData = require('../../models/restaurantModel');
const cashDontionData = require('../../models/cashDonationModel');
const userRouter = express.Router();



userRouter.get('/profile/:loginId', async (req, res) => {
  try {
    const id = req.params.loginId;
    const user = await userData.findOne({ login_id: id }).populate('login_id');
    if (user) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: user,
        Message: 'Data Found',
      })
    } else {
      return res.status(404).json({
        Success: false,
        Error: true,
        data: null,
        Message: 'Data Not Found',
      })
    }

  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      data: null,
      Message: 'Internal Server Error',
    })
  }
})

userRouter.get('/collections', async (req, res) => {
  try {
    const users = await userData.find();
    const orphanages = await orphanageData.find();
    const restaurants = await restaurantData.find();
    const donations = await donationData.find();

    console.log('hi');

    // Properly calculate the total donation amount
    let numbers = donations.reduce((total, data) => {
      if (data.quantity === '0') {
        return total + Number(data.quantity_donated || 0);
      } else {
        return total + Number(data.quantity_donated || 0) + Number(data.quantity || 0);
      }
    }, 0);

    return res.status(200).json({
      Success: true,
      Error: false,
      data: {
        users: users.length,
        orphanages: orphanages.length,
        restaurants: restaurants.length,
        donation: numbers,
      },
      Message: 'Data Found',
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({
      Success: false,
      Error: true,
      data: null,
      Message: 'Internal Server Error',
    });
  }
});


userRouter.get('/update_profile/:id', async (req, res) => {
  try {
    const objectId = req.params.id;
    const previousData = await userData.findOne({
      _id: objectId,
    });
    var updateData = {
      login_id: previousData.login_id,
      name: req.body.name ? req.body.name : previousData.name,
      mobile: req.body.mobile ? req.body.mobile : previousData.mobile,
      address: req.body.address ? req.body.address : previousData.address,
      // image: req.files && req.files.length > 0
      //   ? req.files.map((file) => file.path)
      //   : previousData.image,
    };
    const Data = await userData.updateOne(
      { _id: objectId },
      { $set: updateData }
    );

    if (Data.modifiedCount == 1) {
      return res.status(200).json({
        Success: true,
        Error: false,
        data: Data,
        Message: 'Profile updated successfully',
      });
    } else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while updating profile',
      });
    }
  } catch (error) {
    return res.json({
      Success: false,
      Error: true,
      Message: 'Something went wrong',
    });
  }




})

userRouter.get('/delete_profile/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const userDatas = await userData.deleteOne({ _id: id });
    if (userDatas.deletedCount == 1) {
      const loginDatas = await loginData.deleteOne({ _id: userDatas.login_id });
      return res.status(200).json({
        Success: true,
        Error: false,
        data: userDatas,
        Message: 'Profile deleted successfully',
      });
    }
    else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while deleting profile',
      })
    }
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Something went wrong',
    });
  }
})

userRouter.post('/make_donation', async (req, res) => {
  try {
    const { login_id, restaurant_id, quantity,food_type } = req.body;
    console.log(quantity);
    
 
      const donation = await donationData.create({ login_id, restaurant_id, quantity,food_type, status: 'pending'});
      if (donation) {
        return res.status(200).json({
          Success: true,
          Error: false,
          data: donation,
          Message: 'Donation made successfully',
        });
      } 
      else {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Failed while making donation',
        })
      }
    
    
  } catch (error) {
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Something went wrong',
    });
  }
})

userRouter.put('/assign_donation/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { quantity, requestId } = req.body;
    console.log(quantity, requestId);
    
    const donation = await donationData.findById(id);
    if (!donation) {
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Donation not found',
      });
    }
    const orpDetails = await requestData.findOne({_id:requestId})
    console.log('orpDetails',orpDetails);
    
    if(orpDetails){

      const orphanage_id =  orpDetails.orphanage_id
    
    console.log(Number(donation.quantity)>Number(quantity));
    console.log(Number(donation.quantity),Number(quantity));
    
    if (Number(quantity)>Number(donation.quantity)) {
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Pick the available quantity',
      });
    }
    // Update quantity if provided
    if (quantity) donation.quantity = Number(donation.quantity)-quantity;

    // Add orphanage_id to the array (if provided and not already present)
    if (orphanage_id) {
      if (!mongoose.Types.ObjectId.isValid(orphanage_id)) {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Invalid orphanage_id',
        });
      }
      donation.quantity_donated = (Number(donation.quantity_donated) || 0) + Number(quantity);
      // Check if orphanage already exists in the array
      const orphanageIndex = donation.orphanage_id.findIndex(
        (entry) => entry.orphanage.toString() === orphanage_id
      );

      if (orphanageIndex !== -1) {
        donation.orphanage_id[orphanageIndex].donated =
          (Number(donation.orphanage_id[orphanageIndex].donated) || 0) + Number(quantity);
      } else {
        donation.orphanage_id.push({ orphanage: orphanage_id, donated: quantity });
      }
    }
    if(donation.quantity==='0'){
      donation.status='closed'
    }

    // Save the updated donation
    await donation.save();
    const total_req_donations = Number(orpDetails.requested_quantity)+Number(quantity)
    if(total_req_donations>=Number(orpDetails.requested_quantity)){

      const updateRequst = await requestData.updateOne({_id:requestId},{$set:{donations:total_req_donations, status:'closed'}})
    }else{
      const updateRequst = await requestData.updateOne({_id:requestId},{$set:{donations:total_req_donations}})

    }
    

    
    return res.status(200).json({
      Success: true,
      Error: false,
      data: donation,
      Message: 'Donation updated successfully',
    });
  }
  } catch (error) {
    console.error('Error updating donation:', error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      Details: error.message,
    });
  }
});


userRouter.put('/take_donation/:id', async (req, res) => {
  try {
    const { id } = req.params; 
    const { quantity, requestId,orphanageLogin } = req.body;
    console.log(quantity, requestId);
    
    const donation = await donationData.findById(id);
    if (!donation) {
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Donation not found',
      });
    }
    const orpDetails = await orphanageData.findOne({login_id:orphanageLogin})
    console.log('orpDetails',orpDetails);
    
    if(orpDetails){

      const orphanage_id =  orpDetails._id
    
    console.log(Number(donation.quantity)>Number(quantity));
    console.log(Number(donation.quantity),Number(quantity));
    
    if (Number(quantity)>Number(donation.quantity)) {
      return res.status(404).json({
        Success: false,
        Error: true,
        Message: 'Pick the available quantity',
      });
    }
    // Update quantity if provided
    if (quantity) donation.quantity = Number(donation.quantity)-quantity;

    // Add orphanage_id to the array (if provided and not already present)
    if (orphanage_id) {
      if (!mongoose.Types.ObjectId.isValid(orphanage_id)) {
        return res.status(400).json({
          Success: false,
          Error: true,
          Message: 'Invalid orphanage_id',
        });
      }
      donation.quantity_donated = (Number(donation.quantity_donated) || 0) + Number(quantity);
      // Check if orphanage already exists in the array
      const orphanageIndex = donation.orphanage_id.findIndex(
        (entry) => entry.orphanage.toString() === orphanage_id
      );

      if (orphanageIndex !== -1) {
        donation.orphanage_id[orphanageIndex].donated =
          (Number(donation.orphanage_id[orphanageIndex].donated) || 0) + Number(quantity);
      } else {
        donation.orphanage_id.push({ orphanage: orphanage_id, donated: quantity,status:0 });
      }
    }
    if(donation.quantity==='0'){
      donation.status='closed'
    }

    // Save the updated donation
    await donation.save();
    // const total_req_donations = Number(orpDetails.requested_quantity)+Number(quantity)
    // if(total_req_donations>=Number(orpDetails.requested_quantity)){

    //   const updateRequst = await requestData.updateOne({_id:requestId},{$set:{donations:total_req_donations, status:'closed'}})
    // }else{
    //   const updateRequst = await requestData.updateOne({_id:requestId},{$set:{donations:total_req_donations}})

    // }
    

    
    return res.status(200).json({
      Success: true,
      Error: false,
      data: donation,
      Message: 'Donation Taken successfully',
    });
  }
  } catch (error) {
    console.error('Error updating donation:', error);
    return res.status(500).json({
      Success: false,
      Error: true,
      Message: 'Internal Server Error',
      Details: error.message,
    });
  }
});


userRouter.post('/add-donation', async (req, res) => {
    try {
        const { login_id, orphanage_id, amount } = req.body;

        if (!login_id || !orphanage_id || !amount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newDonation = new cashDontionData({
            login_id,
            orphanage_id,
            amount 
        });

        await newDonation.save();
        res.status(201).json({ message: "Donation added successfully", data: newDonation });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

// Get all donations for a specific orphanage
userRouter.get('/orphanage/:orphanage_id', async (req, res) => {
    try {
        const { orphanage_id } = req.params;

        const donations = await cashDontionData.find({ orphanage_id }).populate('login_id', 'name email');
        
        if (donations.length === 0) {
            return res.status(200).json({ message: "No donations found", totalDonations: 0, totalAmount: "0", donations: [] });
        }

        // Calculate total amount donated
        const totalDonations = donations.length;
        const totalAmount = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0).toFixed(2);

        res.status(200).json({
            totalDonations,
            totalAmount,
            donations
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
});

userRouter.get('/user-donation/:id', async (req, res) => {
  try {
      const { id } = req.params;

      const donations = await cashDontionData.find({ login_id:id }).populate('orphanage_id', 'orphanage_name email mobile');
      
      if (donations.length === 0) {
          return res.status(200).json({ message: "No donations found", totalDonations: 0, totalAmount: "0", donations: [] });
      }

      // Calculate total amount donated
      const totalDonations = donations.length;
      const totalAmount = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0).toFixed(2);

      res.status(200).json({
          totalDonations,
          totalAmount,
          donations
      });

  } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
  }
});

userRouter.get('/user-food-donation/:id', async (req, res) => {
  try {
      const { id } = req.params;

      const donations = await donationData.find({ login_id:id }).populate('orphanage_id', 'orphanage_name email mobile');
      console.log(donations);
      
      if (donations.length === 0) {
          return res.status(200).json({ message: "No donations found", totalDonations: 0, totalAmount: "0", donations: [] });
      }

      // Calculate total amount donated
      const totalDonations = donations.length;
      const totalQuantity = donations.reduce((sum, donation) => sum + parseFloat(donation.quantity), 0).toFixed(0);

      res.status(200).json({
          totalDonations,
          totalQuantity,
          donations
      });

  } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
  }
});








module.exports = userRouter;