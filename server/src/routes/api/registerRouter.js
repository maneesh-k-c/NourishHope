const express = require('express');
const bcrypt = require('bcryptjs');
const loginData = require('../../models/loginModel');
const restaurantData = require('../../models/restaurantModel');
const registerRouter = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const userData = require('../../models/userModel');
const orphanageData = require('../../models/orphanageModel');
const Feedback = require('../../models/feedbackModel');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});
const storageImage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'FoodDonation',
    },
});
const uploadImage = multer({ storage: storageImage });





registerRouter.post('/user', uploadImage.array('image', 1), async (req, res, next) => {
    try {
        const oldEmail = await userData.findOne({ email: req.body.email });
        if (oldEmail) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Email already exist, Please Log In',
            });
        }
        const oldUser = await loginData.findOne({ username: req.body.username });
        if (oldUser) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Username already exist, Please Log In',
            });
        }
        const oldPhone = await userData.findOne({ mobile: req.body.mobile });
        if (oldPhone) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Mobile number already exist',
            });
        }


        let log = {
            username: req.body.username,
            password: req.body.password,
            role: 'user',
            status: 1
        };
        const result = await loginData(log).save();
        console.log(result);
        let reg = {
            login_id: result._id,
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            images: req.files.map((file) => file.path)
            // address: req.body.address
        };
        const result2 = await userData(reg).save();

        if (result2) {
            return res.status(200).json({
                Success: true,
                Error: false,
                data: result2,
                Message: 'Registration Successful',
            });
        } else {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Registration Failed',
            });
        }
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});

registerRouter.get('/getuser', async (req, res, next) => {
    try {
        const result = await userData.find();
        if (result[0]) {
            return res.status(200).json({
                Success: true,
                Error: false,
                data: result
            });
        }
        else {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'No data found',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
})

registerRouter.post('/restaurant', uploadImage.array('image', 1), async (req, res, next) => {
    try {
        console.log(req.body);

        const oldEmail = await loginData.findOne({ username: req.body.username });
        if (oldEmail) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Email already exist, Please Log In',
            });
        }
        const oldPhone = await restaurantData.findOne({ mobile: req.body.mobile });


        if (oldPhone) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Mobile number already exist',
            });
        }
        let log = {
            username: req.body.username,
            password: req.body.password,
            role: 'restaurant',
            status: 1
        };


        const result = await loginData(log).save();
        console.log(result);
        let reg = {
            login_id: result._id,
            restaurant_name: req.body.restaurant_name,
            mobile: req.body.mobile,
            email: req.body.email,
            upi: req.body.upi,
            rating:[],
            address: req.body.address,
            description: req.body.description,
            restaurant_images: req.files ? req.files.map((file) => file.path) : null,
        };
        const result2 = await restaurantData(reg).save();

        if (result2) {
            return res.json({
                Success: true,
                Error: false,
                data: result2,
                Message: 'Registration Successful',
            });
        } else {
            return res.json({
                Success: false,
                Error: true,
                Message: 'Registration Failed',
            });
        }
    } catch (error) {
        return res.json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});

// registerRouter.get('/getrestaurant', async (req, res) => {
//     try {
//         const result = await restaurantData.find().populate('login_id');
//         // const Rating = result.rating.length
//         // const totalRating = result.reduce((sum, rating) => sum + result.rating, 0);
//         // const averageRating = (totalRating / totalReviews).toFixed(1);
//         if (result[0]) {
//             return res.status(200).json({
//                 Success: true,
//                 Error: false,
//                 data: result,
//                 Message: 'Data Found',
//             });
//         }
//         else {
//             return res.status(400).json({
//                 Success: false,
//                 Error: true,
//                 Message: 'Data Not Found',
//             });
//         }
//     } catch (error) {
//         return res.status(500).json({
//             Success: false,
//             Error: true,
//             Message: 'Something went wrong',
//         });
//     }
// })

registerRouter.get('/getrestaurant', async (req, res) => {
    try {
        const result = await restaurantData.find().populate('login_id');

        if (!result.length) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Data Not Found',
            });
        }

        // Map through restaurants and calculate the total & average rating
        const formattedResult = result.map(restaurant => {
            const totalReviews = restaurant.rating.length;
            const totalRating = restaurant.rating.reduce((sum, r) => sum + r.value, 0);
            const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "No Ratings";

            return {
                ...restaurant.toObject(), // Convert Mongoose document to plain object
                totalReviews,
                totalRating,
                averageRating
            };
        });

        return res.status(200).json({
            Success: true,
            Error: false,
            data: formattedResult,
            Message: 'Data Found',
        });

    } catch (error) {
        console.error("Error fetching restaurants:", error);
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});


registerRouter.post('/orphanage', uploadImage.array('orphanage_images', 1), async (req, res, next) => {
    try {
        const oldEmail = await loginData.findOne({ email: req.body.email });
        if (oldEmail) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Email already exist, Please Log In',
            });
        }
        const oldPhone = await orphanageData.findOne({ mobile: req.body.mobile });
        if (oldPhone) {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Mobile number already exist',
            });
        }

        let log = {
            username: req.body.username,
            password: req.body.password,
            role: 'orphanage',
            status: 1
        };

        const result = await loginData(log).save();
        console.log(result);
        let reg = {
            login_id: result._id,
            orphanage_name: req.body.orphanage_name,
            mobile: req.body.mobile,
            email: req.body.email,
            description: req.body.description,
            upi: req.body.upi,
            address: req.body.address,
            orphanage_images: req.files ? req.files.map((file) => file.path) : null,
        };
        console.log(reg);
        const result2 = await orphanageData(reg).save();

        if (result2) {
            return res.json({
                Success: true,
                Error: false,
                data: result2,
                Message: 'Registration Successful',
            });
        } else {
            return res.json({
                Success: false,
                Error: true,
                Message: 'Registration Failed',
            });
        }
    } catch (error) {
        return res.json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});

registerRouter.put('/update-orphanage/:id', async (req, res) => {
    try {
        const orphanageId = req.params.id;
        const orphanage = await orphanageData.findOne({ login_id: orphanageId });
        console.log(req.body);
        console.log('hi');
        if (!orphanage) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: 'Orphanage not found',
            });
        }

        // Check if email is being updated and if it already exists
        if (req.body.email && req.body.email !== orphanage.email) {
            const emailExists = await loginData.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Email already exists',
                });
            }
        }

        // Check if mobile number is being updated and if it already exists
        if (req.body.mobile && req.body.mobile !== orphanage.mobile) {
            const mobileExists = await orphanageData.findOne({ mobile: req.body.mobile });
            if (mobileExists) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Mobile number already exists',
                });
            }
        }
        console.log('hi');

        // Update orphanage details
        const logData = {
            username: req.body.username || orphanage.username,
            password: req.body.password || orphanage.password,
        }
        const orpData = {
            orphanage_name: req.body.orphanage_name || orphanage.orphanage_name,
            mobile: req.body.mobile || orphanage.mobile,
            email: req.body.email || orphanage.email,
            upi: req.body.upi || orphanage.upi,
            address: req.body.address || orphanage.address,
        }
        const updateOrp = await orphanageData.updateOne({ login_id: orphanageId }, { $set: orpData })
        const updateLog = await loginData.updateOne({ _id: orphanageId }, { $set: logData })
        // if (req.files && req.files.length > 0) {
        //     orphanage.orphanage_images = req.files.map((file) => file.path);
        // }
        console.log('orpData', orpData);
        console.log(updateOrp);



        return res.json({
            Success: true,
            Error: false,
            data: orphanage,
            Message: 'Orphanage details updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});

registerRouter.post('/update-user', async (req, res) => {
    try {
        const loginId = req.body.loginId;
        const user = await userData.findOne({ login_id: loginId });
        console.log(req.body);
        console.log('hi');
        if (!user) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: 'User not found',
            });
        }

        // Check if email is being updated and if it already exists
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await loginData.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Email already exists',
                });
            }
        }

        // Check if mobile number is being updated and if it already exists
        if (req.body.mobile && req.body.mobile !== user.mobile) {
            const mobileExists = await orphanageData.findOne({ mobile: req.body.mobile });
            if (mobileExists) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Mobile number already exists',
                });
            }
        }
        console.log('hi');

        // Update orphanage details
        const logData = {
            username: req.body.username || user.username,
            password: req.body.password || user.password,
        }
        const orpData = {
            name: req.body.name || user.name,
            mobile: req.body.mobile || user.mobile,
            email: req.body.email || user.email,
           
        }
        const updateOrp = await userData.updateOne({ login_id: loginId }, { $set: orpData })
        const updateLog = await loginData.updateOne({ _id: loginId }, { $set: logData })
        // if (req.files && req.files.length > 0) {
        //     orphanage.orphanage_images = req.files.map((file) => file.path);
        // }
        console.log('orpData', orpData);
        console.log(updateOrp);



        return res.json({
            Success: true,
            Error: false,
            Message: 'User details updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});

registerRouter.post('/update-rest', async (req, res) => {
    try {
        const loginId = req.body.loginId;
        const user = await restaurantData.findOne({ login_id: loginId });
        console.log(req.body);
        console.log('hi');
        if (!user) {
            return res.status(404).json({
                Success: false,
                Error: true,
                Message: 'Restaurant not found',
            });
        }

        // Check if email is being updated and if it already exists
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await loginData.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Email already exists',
                });
            }
        }

        // Check if mobile number is being updated and if it already exists
        if (req.body.mobile && req.body.mobile !== user.mobile) {
            const mobileExists = await restaurantData.findOne({ mobile: req.body.mobile });
            if (mobileExists) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Mobile number already exists',
                });
            }
        }
        console.log('hi');

        // Update orphanage details
        const logData = {
            username: req.body.username || user.username,
            password: req.body.password || user.password,
        }
        const orpData = {
            restaurant_name: req.body.restaurant_name || user.restaurant_name,
            mobile: req.body.mobile || user.mobile,
            email: req.body.email || user.email,
            description: req.body.description || user.description,
            upi: req.body.description || user.upi,
            address: req.body.description || user.address,
           
        }
        const updateOrp = await restaurantData.updateOne({ login_id: loginId }, { $set: orpData })
        const updateLog = await loginData.updateOne({ _id: loginId }, { $set: logData })
        // if (req.files && req.files.length > 0) {
        //     orphanage.orphanage_images = req.files.map((file) => file.path);
        // }
        console.log('orpData', orpData);
        console.log(updateOrp);



        return res.json({
            Success: true,
            Error: false,
            Message: 'Details updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});

registerRouter.get('/get-single-orphanage/:id', async (req, res) => {
    try {
        const result = await orphanageData.findOne({ login_id: req.params.id }).populate('login_id');
        if (result) {
            const data = {
                orphanage_name: result.orphanage_name,
                email: result.email,
                mobile: result.mobile,
                address: result.address,
                upi: result.upi || '',
                username: result.login_id.username,
                password: result.login_id.password,

            }
            return res.status(200).json({
                Success: true,
                Error: false,
                data: data,
                Message: 'Data Found',
            });
        }
        else {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Data Not Found',
            });
        }
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
})

registerRouter.get('/getorphanage', async (req, res) => {
    try {
        const result = await orphanageData.find().populate('login_id');
        if (result[0]) {
            return res.status(200).json({
                Success: true,
                Error: false,
                data: result,
                Message: 'Data Found',
            });
        }
        else {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Data Not Found',
            });
        }
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
})

registerRouter.post('/login', async (req, res, next) => {
    try {

        if (req.body.username && req.body.password) {

            const oldUser = await loginData.findOne({
                username: req.body.username,
            });
            console.log(req.body.password);

            if (!oldUser) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'You have to Register First',
                });
            }

            if (oldUser.status == 0) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Waiting for admins approval',
                });
            }


            if (req.body.password != oldUser.password) {
                return res.status(400).json({
                    Success: false,
                    Error: true,
                    Message: 'Password Incorrect',
                });
            }

            return res.status(200).json({
                success: true,
                error: false,
                loginId: oldUser._id,
                username: oldUser.username,
                role: oldUser.role,
            });
        } else {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'All field are required',
            });
        }
    } catch (error) {
        return res.status(500).json({
            Success: false,
            Error: true,
            Message: 'Something went wrong',
        });
    }
});

registerRouter.get('/getProfile/:id/:role', async (req, res) => {
    try {
        const { id, role } = req.params
        console.log(id, role);

        if (role == 'orphanage') {
            const ownerList = await orphanageData.findOne({ login_id: id }).populate('login_id')
            if (ownerList) {
                return res.status(200).json({
                    success: true,
                    data: ownerList,
                });
            }
        }
        else if (role == 'restaurant') {
            const ownerList = await restaurantData.findOne({ login_id: id }).populate('login_id')
            if (ownerList) {
                return res.status(200).json({
                    success: true,
                    data: ownerList,
                });
            }
        }
        else if (role == 'user') {
            const userList = await userData.findOne({ login_id: id }).populate('login_id')
            console.log(userList);

            if (userList) {
                return res.status(200).json({
                    success: true,
                    data: userList,
                });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});

registerRouter.get('/orphanage_delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userDatas = await orphanageData.deleteOne({ _id: id });
        if (userDatas.deletedCount == 1) {
            const loginDatas = await loginData.deleteOne({ _id: userDatas.login_id });
            return res.status(200).json({
                Success: true,
                Error: false,
                data: userDatas,
                Message: 'Orphanage deleted successfully',
            });
        }
        else {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Failed while deleting orphanage',
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

registerRouter.get('/delete_rest/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userDatas = await restaurantData.deleteOne({ _id: id });
        if (userDatas.deletedCount == 1) {
            const loginDatas = await loginData.deleteOne({ _id: userDatas.login_id });
            return res.status(200).json({
                Success: true,
                Error: false,
                data: userDatas,
                Message: 'Restaurant deleted successfully',
            });
        }
        else {
            return res.status(400).json({
                Success: false,
                Error: true,
                Message: 'Failed while deleting restaurant',
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

module.exports = registerRouter