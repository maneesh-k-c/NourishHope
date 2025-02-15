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
        const updateRest = await restaurantData.updateOne({_id:restaurantId},{$set:{rating:rating}})

        const feedback = new Feedback({
            feedbackText,
            userLoginId,
            restaurantId,
            rating
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
        const id = await restaurantData.findOne({ login_id: login_id })
                                        

        const donations = await donationData.find({ restaurant_id: id?._id })
            .populate('login_id', 'username email')
            // .populate({
            //     path: 'login_id',
            //     model: 'user_tb',
            //     select: 'name mobile email'
            // })
            .populate('orphanage_id.orphanage', 'orphanage_name address mobile');
            
            // const userDatas = await userData.findOne({login_id:donations[0]?.login_id?._id})
            // donations.user=userDatas
            if (donations.length > 0 && donations[0].login_id) {
                for (let i = 0; i < donations.length; i++) {
                    if (donations[i].login_id) { // Ensure login_id is not null
                        const userDatas = await userData.findOne({ login_id: donations[i]?.login_id?._id });
                        donations[i] = { ...donations[i]._doc, user: userDatas }; // Correct way to add user data
                    }
                }
                
                console.log(donations);
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
            Details: error,
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


module.exports = restaurantRouter