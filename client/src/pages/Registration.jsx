import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import React, { useState } from 'react';

export default function Registration() {
    const [formType, setFormType] = useState('user');

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        image: '',
        username: '',
        password: '',
    });
    const [formRestData, setFormRestData] = useState({
        restaurant_name: '',
        mobile: '',
        email: '',
        description:'',
        upi:'',
        address:'',
        image: '',
        username: '',
        password: '',
    });
    console.log(formRestData);


    const [errors, setErrors] = useState({});
    const [resterrors, setrestErrors] = useState({});

    const handleFormSwitch = (type) => {
        setFormType(type);
        setFormData({ name: '',mobile: '',email: '',image: '',username: '',password: ''});
        setFormRestData({ restaurant_name: '',mobile: '',email: '',upi:'',address:'',image: '',username: '',password: ''})
        setErrors({});
        setrestErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };
    const handlerestInputChange = (e) => {
        const { name, value } = e.target;
        setFormRestData({ ...formRestData, [name]: value });
        setrestErrors({ ...resterrors, [name]: '' });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: files[0] || '',
        });
    };
    const handlerestFileChange = (e) => {
        const { name, files } = e.target;
        setFormRestData({
            ...formRestData,
            [name]: files[0] || '',
        });
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            newErrors.name = 'This field is required';
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = 'This field is required';
            isValid = false;
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }
        if (!formData.mobile.trim()) {
            console.log('hi');

            newErrors.mobile = 'This field is required';
            isValid = false;
        } else if (!/^\d+$/.test(formData.mobile)) {
            console.log('hello');

            newErrors.mobile = 'Invalid mobile format';
            isValid = false;
        } else if (formData.mobile.length !== 10) {
            newErrors.mobile = 'Invalid mobile format';
            isValid = false;
        }

        if (!formData.username.trim()) {
            newErrors.username = 'This field is required';
            isValid = false;
        }
        if (!formData.password.trim()) {
            newErrors.password = 'This field is required';
            isValid = false;
        }

        if (!formData.image) {
            newErrors.image = 'File is required';
            isValid = false;
        }


        setErrors(newErrors);
        return isValid;
    };

    const validateRestForm = () => {
        const newErrors = {};
        let isValid = true;

        if (!formRestData.restaurant_name.trim()) {
            newErrors.restaurant_name = 'This field is required';
            isValid = false;
        }
        if (!formRestData.address.trim()) {
            newErrors.address = 'This field is required';
            isValid = false;
        }
        if (!formRestData.description){
            newErrors.description = 'This field is required';
            isValid = false;
        }
        if (!formRestData.upi.trim()) {
            newErrors.upi = 'This field is required';
            isValid = false;
        }
        if (!formRestData.email.trim()) {
            newErrors.email = 'This field is required';
            isValid = false;
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formRestData.email)) {
            newErrors.email = 'Invalid email format';
            isValid = false;
        }
        if (!formRestData.mobile.trim()) {
            console.log('hi');

            newErrors.mobile = 'This field is required';
            isValid = false;
        } else if (!/^\d+$/.test(formRestData.mobile)) {
            console.log('hello');

            newErrors.mobile = 'Invalid mobile format';
            isValid = false;
        } else if (formRestData.mobile.length !== 10) {
            newErrors.mobile = 'Invalid mobile format';
            isValid = false;
        }

        if (!formRestData.username.trim()) {
            newErrors.username = 'This field is required';
            isValid = false;
        }
        if (!formRestData.password.trim()) {
            newErrors.password = 'This field is required';
            isValid = false;
        }

        if (!formRestData.image) {
            newErrors.image = 'File is required';
            isValid = false;
        }


        setrestErrors(newErrors);
        return isValid;
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Submitted', formData);
            if (formType === 'user') {
                const formDataToSend = new FormData();

                formDataToSend.append('name', formData.name);
                formDataToSend.append('mobile', formData.mobile);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('image', formData.image);
                formDataToSend.append('username', formData.username);
                formDataToSend.append('password', formData.password);
                axios.post('http://localhost:5000/api/auth/user', formDataToSend).then((res) => {
                    toast.success(res.data.Message)
                    setTimeout(() => {
                        navigate("/login")
                    }, 2000);
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                    toast.success(err.response.data.Message)
                });
            }
        }

    };

    const handleSubmitrest = (e) => {
        e.preventDefault();
        if (validateRestForm()) {
            console.log('Form Submitted', formData);

            const formDataToSend = new FormData();
            

            formDataToSend.append('restaurant_name', formRestData.restaurant_name);
            formDataToSend.append('mobile', formRestData.mobile);
            formDataToSend.append('email', formRestData.email);
            formDataToSend.append('upi', formRestData.upi);
            formDataToSend.append('address', formRestData.address);
            formDataToSend.append('image', formRestData.image);
            formDataToSend.append('username', formRestData.username);
            formDataToSend.append('password', formRestData.password);       
           
            axios.post('http://localhost:5000/api/auth/restaurant', formDataToSend).then((res) => {
                toast.success(res.data.Message)
                setTimeout(() => {
                    navigate("/login")
                }, 2000);
                console.log(res);
            }).catch((err) => {
                console.log(err);
                toast.success(err.response.data.Message)
            });

        }

    };


    return (
        <>
            <div className="container">
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <div
                    className="volunteer"
                    data-parallax="scroll"
                    data-image-src="img/volunteer.jpg"
                >
                    <div className="row align-items-center">
                        <div className="col-lg-5">
                            <div className="volunteer-content">
                                <div className="section-header">
                                    <p>Become A Member</p>
                                    <h2>Let’s make a difference in the lives of others</h2>
                                </div>
                                <div className="volunteer-text">
                                    <p>
                                    Register now to be part of a meaningful initiative that connects restaurants, orphanages, and donors.
                                    By signing up, you can donate food or funds to support orphanages, partner with restaurants to make a difference, track your contributions and impact in real-time, and receive instant notifications and updates. 
                                    Every small act of kindness counts. Sign up today and help us spread hope.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="volunteer-form">
                                <div className="form-switch-buttons" style={{ display: 'flex', marginTop: '-50px', marginBottom: '50px' }}>
                                    <button
                                        className={`btn btn-custom ${formType === 'user' ? 'active' : ''}`}
                                        onClick={() => handleFormSwitch('user')}
                                        style={{ backgroundColor: formType === 'user' ? '#fff' : '', color: formType === 'user' ? '#FDBE33' : '' }}
                                    >
                                        Register as User
                                    </button>
                                    <button
                                        className={`btn btn-custom ${formType === 'restaurant' ? 'active' : ''}`}
                                        style={{ backgroundColor: formType === 'restaurant' ? '#fff' : '', color: formType === 'restaurant' ? '#FDBE33' : '' }}
                                        onClick={() => handleFormSwitch('restaurant')}
                                    >
                                        Register as Restaurant
                                    </button>
                                </div>

                                {/* User Registration Form */}
                                {formType === 'user' ? (
                                    <form onSubmit={handleSubmit}>

                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Name"
                                                style={{ borderColor: errors.name ? '#dc3545' : '' }}
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.name}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="mobile"
                                                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                                placeholder="Mobile"
                                                style={{ borderColor: errors.mobile ? '#dc3545' : '' }}
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.email}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                placeholder="Email"
                                                style={{ borderColor: errors.email ? '#dc3545' : '' }}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.email}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="file"
                                                name="image"
                                                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                                placeholder="Image"
                                                style={{ borderColor: errors.image ? '#dc3545' : '' }}
                                                onChange={handleFileChange}
                                                accept=".jpg, .jpeg, .png"
                                            />
                                            {errors.image && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.image}</div>}
                                        </div>

                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="username"
                                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                                placeholder="Username"
                                                style={{ borderColor: errors.username ? '#dc3545' : '' }}
                                                value={formData.username}
                                                onChange={handleInputChange}
                                            />
                                            {errors.username && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.username}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="password"
                                                name="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Password"
                                                style={{ borderColor: errors.password ? '#dc3545' : '' }}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            {errors.password && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.password}</div>}
                                        </div>
                                        <div>
                                            <button className="btn btn-custom" type="submit">
                                                Register as User
                                            </button>
                                        </div>
                                        <div className="donate-text" style={{ paddingTop: '30px' }}>
                                            <p>
                                                Don't have an account? <a href="/login" className='reglink'>Login Now!</a>
                                            </p>
                                        </div>
                                    </form>
                                ) : (
                                    // Restaurant Registration Form

                                    <form onSubmit={handleSubmitrest}>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="restaurant_name"
                                                style={{ borderColor: resterrors.restaurant_name ? '#dc3545' : '' }}
                                                className={`form-control ${resterrors.restaurant_name ? 'is-invalid' : ''}`}
                                                placeholder="Restaurant Name"
                                                value={formRestData.restaurant_name}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.restaurant_name && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.restaurant_name}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="mobile"
                                                style={{ borderColor: resterrors.mobile ? '#dc3545' : '' }}
                                                className={`form-control ${resterrors.mobile ? 'is-invalid' : ''}`}
                                                placeholder="Mobile"
                                                value={formRestData.mobile}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.mobile && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.mobile}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                name="email"
                                                style={{ borderColor: resterrors.email ? '#dc3545' : '' }}
                                                className={`form-control ${resterrors.email ? 'is-invalid' : ''}`}
                                                placeholder="Restaurant Email"
                                                value={formRestData.email}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.email && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.email}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="upi"
                                                style={{ borderColor: resterrors.upi ? '#dc3545' : '' }}
                                                className={`form-control ${resterrors.upi ? 'is-invalid' : ''}`}
                                                placeholder="upi id"
                                                value={formRestData.upi}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.upi && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.upi}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="file"
                                                name="image"
                                                accept=".jpg, .jpeg, .png"
                                                className={`form-control ${resterrors.image ? 'is-invalid' : ''}`}
                                                placeholder="Image"
                                                style={{ borderColor: resterrors.image ? '#dc3545' : '' }}
                                                onChange={handlerestFileChange}
                                            />
                                            {resterrors.image && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.image}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <textarea
                                                name="address"
                                                className={`form-control ${resterrors.address ? 'is-invalid' : ''}`}
                                                placeholder="Address"
                                                value={formRestData.address}
                                                style={{ borderColor: resterrors.address ? '#dc3545' : '' }}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.address && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.address}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <textarea
                                                name="description"
                                                className={`form-control ${resterrors.description ? 'is-invalid' : ''}`}
                                                placeholder="Description"
                                                
                                                style={{ borderColor: resterrors.description ? '#dc3545' : '' }}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.address && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.description}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="username"
                                                className={`form-control ${resterrors.username ? 'is-invalid' : ''}`}
                                                placeholder="Username"
                                                style={{ borderColor: resterrors.username ? '#dc3545' : '' }}
                                                value={formRestData.username}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.username && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.username}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="password"
                                                name="password"
                                                className={`form-control ${resterrors.password ? 'is-invalid' : ''}`}
                                                placeholder="Password"
                                                style={{ borderColor: resterrors.password ? '#dc3545' : '' }}
                                                value={formRestData.password}
                                                onChange={handlerestInputChange}
                                            />
                                            {resterrors.password && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{resterrors.password}</div>}
                                        </div>
                                        <div>
                                            <button className="btn btn-custom" type="submit">
                                                Register as Restaurant
                                            </button>
                                        </div>
                                        <div className="donate-text" style={{ paddingTop: '30px' }}>
                                            <p>
                                                Don't have an account? <a href="/login" className='reglink'>Login Now!</a>
                                            </p>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
