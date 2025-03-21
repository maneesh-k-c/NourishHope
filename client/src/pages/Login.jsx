import React, { useState, useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            mirror: false,
        });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const validateForm = () => {
        let isValid = true;
        let newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'username is required';
            isValid = false;
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form Submitted', formData);
            axios.post('http://localhost:5000/api/auth/login', formData)
                .then(response => {
                    localStorage.setItem('loginId', response.data.loginId);
                    localStorage.setItem('role', response.data.role);
                    localStorage.setItem('username', response.data.username);
                    navigate('/')
                })  
                .catch(error => {
                    console.log(error);
                    toast.error(error.response.data.Message)

                    // Handle login error
                });



        }
    };

    return (
        <>
            {/* Donate Start */}
            <div className="container">
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <div
                    className="donate"
                    data-parallax="scroll"
                    data-image-src="img/donate.jpg"
                >
                    <div className="row align-items-center">
                        <div className="col-lg-7" data-aos="fade-right">
                            <div className="donate-content">
                                <div className="section-header">
                                    <p>Donate Now</p>
                                    <h2>Let's donate to needy people for better lives</h2>
                                </div>
                                <div className="donate-text">
                                    <p>
                                    Welcome back! Continue your journey of giving by logging in. Access your donation history, connect with restaurants and orphanages, and make an impact with just a few clicks. Stay updated with real-time notifications and keep spreading kindness. Your support matters!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5" data-aos="fade-left">
                            <div className="donate-form">
                                <form onSubmit={handleSubmit}>
                                    <div className="control-group" style={{ position: 'relative' }}>
                                        <input
                                            type="text"
                                            name="username"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            placeholder="username"
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
                                            style={{ borderColor: errors.password ? '#dc3545' : '' }}
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            placeholder="Password"
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
                                            Login
                                        </button>
                                    </div>
                                    <div className="donate-text" style={{ paddingTop: '30px' }}>
                                        <p>
                                            Don't have an account? <a href="/register" className='reglink'>Register Now!</a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            {/* Donate End */}
        </>
    );
}
