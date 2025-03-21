const express = require('express');
const restaurantData = require('../../models/restaurantModel');
const Feedback = require('../../models/feedbackModel');
const donationData = require('../../models/donationModel');
const { default: mongoose } = require('mongoose');
const userData = require('../../models/userModel');
const restaurantRouter = express.Router();


restaurantRouter.get('/singel-rest/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const rest = await restaurantData.findOne({ _id: id }).populate('login_id');
        if (rest) {
            return res.status(200).json({
                Success: true,
                Error: false,
                data: rest,
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

restaurantRouter.post('/submitfeedback', async (req, res) => {  
    try {
        console.log(req.body);

        const { feedbackText, userLoginId, restaurantId, rating } = req.body;

        if (!feedbackText || !userLoginId) {
            return res.status(400).json({
                success: false,
                message: 'Feedback text and userId are required',
            });
        }

        const totalReviews = await restaurantData.findOne({_id:restaurantId});
        console.log(totalReviews);

        totalReviews.rating.push({ userId: userLoginId, value: rating });
        await totalReviews.save();
        // const updateRest = await restaurantData.updateOne({_id:restaurantId},{$set:{rating:averageRating}})

        const feedback = new Feedback({
            feedbackText,
            userLoginId,
            restaurantId,
        });
        await feedback.save();

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully',
            data: feedback,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
        });
    }
});

restaurantRouter.get('/delete_feedback/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const orphanageDatas = await Feedback.deleteOne({ _id: id });
    if (orphanageDatas.deletedCount == 1) {      
      return res.status(200).json({
        Success: true,
        Error: false,
        data: orphanageDatas,
        Message: 'Feedback deleted successfully',
      });
    }
    else {
      return res.status(400).json({
        Success: false,
        Error: true,
        Message: 'Failed while deleting feedback',
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

restaurantRouter.get('/view-single-feedback/:id', async (req, res) => {
    try {
        const { id } = req.params
        const feedbackList = await Feedback.aggregate([
            {
                '$lookup': {
                    'from': 'restaurant_tbs',
                    'localField': 'userLoginId',
                    'foreignField': 'login_id',
                    'as': 'user'
                }
            }, {
                '$unwind': '$user'
            },
            {
                '$match': {
                    'restaurantId': new mongoose.Types.ObjectId(id)
                }
            },

        ])
        res.status(200).json({
            success: true,
            data: feedbackList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve feedback',
        });
    }
});

restaurantRouter.get('/viewfeedback', async (req, res) => {
    try {
        const feedbackList = await Feedback.find().populate('restaurantId').populate('userLoginId')
        res.status(200).json({
            success: true,
            data: feedbackList,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve feedback',
        });
    }
});

restaurantRouter.get('/list_donations/:login_id', async (req, res) => {
    try {
        const { login_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(login_id)) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Invalid login_id',
            });
        }

        // Find the restaurant linked to this login_id
        const restaurant = await restaurantData.findOne({ login_id: login_id });

        if (!restaurant) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: 'Restaurant not found',
            });
        }

        // Find donations related to this restaurant
        const donations = await donationData.find({ restaurant_id: restaurant._id })
            .populate('login_id', 'username email')
            .populate('orphanage_id.orphanage', 'orphanage_name address mobile');

        if (!donations.length) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: 'No donations found for this restaurant',
            });
        }

        // Fetch user details for each donation's login_id in parallel
        const userDetailsPromises = donations.map(async (donation) => {
            if (donation.login_id) {
                const userDatas = await userData.findOne({ login_id: donation.login_id._id });
                return { ...donation._doc, user: userDatas };
            }
            return donation._doc;
        });

        const enrichedDonations = await Promise.all(userDetailsPromises);

        return res.status(200).json({
            Success: true,
            Error: false,
            data: enrichedDonations,
        });

    } catch (error) {
        console.error('Error fetching donations:', error);
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Internal Server Error',
            Details: error.message,
        });
    }
});


restaurantRouter.get('/list_donations_user/:login_id', async (req, res) => {
    try {
        const { login_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(login_id)) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Invalid login_id',
            });
        }
        // const id = await restaurantData.findOne({ login_id: login_id })
        // console.log('orp', id);

        const donations = await donationData.find({ login_id: login_id })
            .populate('restaurant_id', 'restaurant_name mobile address')
            // .populate({
            //     path: 'login_id',
            //     model: 'user_tb',
            //     select: 'name mobile email'
            // })
            .populate('orphanage_id.orphanage', 'orphanage_name address mobile');
        // const userDatas = await userData.findOne({login_id:donations.login_id._id})
        // donations.user=userDatas
        if (donations.length > 0 && donations[0].login_id) {
            for (let i = 0; i < donations.length; i++) {
                if (donations[i].login_id) { // Ensure login_id is not null
                    // const userDatas = await userData.findOne({ login_id: donations[i].login_id._id });
                    donations[i] = { ...donations[i]._doc}; // Correct way to add user data
                }
            }
        
            return res.status(200).json({
                Success: true,
                Error: false,
                data: donations,
            });
        }

        if (!donations.length) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: 'No donations found for this restaurant',
            });
        }



    } catch (error) {
        console.error('Error fetching donations:', error);
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Internal Server Error',
            Details: error.message,
        });
    }
});

restaurantRouter.get('/list_donations_orp/', async (req, res) => {
    try {
        
        

        const donations = await donationData.find({status:'pending'})
            .populate('login_id', 'username email')
            // .populate({
            //     path: 'login_id',
            //     model: 'user_tb',
            //     select: 'name mobile email'
            // })
            .populate('orphanage_id.orphanage', 'orphanage_name address mobile')
            .populate('restaurant_id', 'restaurant_name address mobile restaurant_images');
        // const userDatas = await userData.findOne({login_id:donations.login_id._id})
        // donations.user=userDatas
        console.log(donations);
        
        if (donations.length > 0 && donations[0].login_id) {
            for (let i = 0; i < donations.length; i++) {
                if (donations[i].login_id) { // Ensure login_id is not null
                    const userDatas = await userData.findOne({ login_id: donations[i].login_id._id });
                    donations[i] = { ...donations[i]._doc, user: userDatas }; // Correct way to add user data
                }
            }
        
            return res.status(200).json({
                Success: true,
                Error: false,
                data: donations,
            });
        }

        if (!donations.length) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: 'No donations found',
            });
        }



    } catch (error) {
        console.error('Error fetching donations:', error);
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Internal Server Error',
            Details: error.message,
        });
    }
});

// restaurantRouter.get('/update_donations/:login_id', async (req, res) => {
//     try {
//         const { login_id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(login_id)) {
//             return res.status(400).json({
//                 Success: false,
//                 Error: true,
//                 Message: 'Invalid login_id',
//             });
//         }
       
                                        

//         const donations = await donationData.find({ login_id: login_id })
           
//             if (donations.length > 0 && donations[0].login_id) {
//                 for (let i = 0; i < donations.length; i++) {
//                     if (donations[i].orphanage_id) { // Ensure login_id is not null
//                         const userDatas = await userData.updateOne({ login_id: donations[i]?.login_id?._id });
//                         donations[i] = { ...donations[i]._doc, user: userDatas }; // Correct way to add user data
//                     }
//                 }
                
               
//             return res.status(200).json({
//                 Success: true,
//                 Error: false,
//                 data: donations,
//             });
//         }

//         if (!donations.length) {
//             return res.status(404).json({
//                 Success: false,
//                 Error: true,
//                 Message: 'No donations found for this restaurant',
//             });
//         }



//     } catch (error) {
//         console.error('Error fetching donations:', error);
//         return res.status(500).json({
//             Success: false,
//             Error: true,
//             Message: 'Internal Server Error',
//             Details: error,
//         });
//     }
// });

restaurantRouter.put('/update_donations/:loginId', async (req, res) => {
    try {
        const { loginId } = req.params;

        const updatedData = await donationData.updateMany(
            { login_id: loginId, "orphanage_id.status": { $exists: true } }, // Ensures field exists
            { 
                $set: { "orphanage_id.$[].status": 1 } // Update all orphanage_id.status fields
            }
        );

        console.log(updatedData);

        if (updatedData.matchedCount === 0) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: "No matching records found for the given login_id."
            });
        }

        return res.status(200).json({
            Success: true,
            Error: false,
            Message: "Status updated successfully.",
            UpdatedCount: updatedData.modifiedCount
        });

    } catch (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: "Something went wrong.",
        });
    }
});





module.exports = restaurantRouter