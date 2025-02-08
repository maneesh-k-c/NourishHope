const express = require('express');
const bcrypt = require('bcryptjs');
const loginData = require('../../models/loginModel');
const restaurantData = require('../../models/restaurantModel');
const registerRouter = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const userData = require('../../models/userModel');
const orphanageData = require('../../models/orphanageModel');
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
            upi: req.body.upi,
            address: req.body.address,
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

registerRouter.get('/getrestaurant', async (req, res) => {
    try {
        const result = await restaurantData.find().populate('login_id');
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