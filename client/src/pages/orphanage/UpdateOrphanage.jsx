import React, { useState,useEffect } from 'react';
import NavBar from '../../components/navbar/NavBar';
import Footer from '../../components/navbar/Footer';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function UpdateOrphanage() {
const navigate = useNavigate()
    const [formData, setFormData] = useState({
        orphanage_name: '',
        email: '',
        mobile: '',
        address: '',
        upi:'',
        username: '',
        password: '',
        // orphanage_images: null,
    });

    console.log(formData);

    useEffect(() => {
        const login = localStorage.getItem('loginId');
         axios.get(`http://localhost:5000/api/auth/get-single-orphanage/${login}`).then((res) => {
                console.log(res.data.data);
                setFormData(res.data.data)
            })
    },[])

    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            orphanage_images: e.target.files[0]
        });
    };

    const validateForm = () => {
        const newErrors = {};
        // Validation logic
        if (!formData.orphanage_name) newErrors.orphanage_name = 'Orphanage name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.mobile) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number must be 10 digits';
        }
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } 
        if (!formData.upi.trim()) {
            newErrors.upi = 'Upi is required';
          
        }
        // else if (formData.password.length < 6) {
        //     newErrors.password = 'Password must be at least 6 characters';
        // }
       

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
          const id = localStorage.getItem('loginId')
            axios.put(`http://localhost:5000/api/auth/update-orphanage/${id}`, formData).then((res) => {
                console.log(res);
                toast.success('Orphanage added successfully');
                setTimeout(() => {
                    navigate("/profile")
                }, 2000);
            })
        }
    };
  return (
     <>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                {/* Top Bar Start */}
                <div className="top-bar d-none d-md-block">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="top-bar-left">
                                    <div className="text">
                                        <i className="fa fa-phone-alt" />
                                        <p>+91 1234567890</p>
                                    </div>
                                    <div className="text">
                                        <i className="fa fa-envelope" />
                                        <p>nourishhope2025@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="top-bar-right">
                                    <div className="social">
                                        <a href="">
                                            <i className="fab fa-twitter" />
                                        </a>
                                        <a href="">
                                            <i className="fab fa-facebook-f" />
                                        </a>
                                        <a href="">
                                            <i className="fab fa-linkedin-in" />
                                        </a>
                                        <a href="">
                                            <i className="fab fa-instagram" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Top Bar End */}
    
                {/* Nav Bar Start */}
                <NavBar />
                {/* Nav Bar End */}
    
                {/* Page Header Start */}
                <div className="page-header" style={{ paddingBottom: '10px' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2>Update Profile</h2>
                            </div>
                            <div className="col-12">
                                <a href="">Home</a>
                                <a href="">Update Profile</a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Page Header End */}
    
                {/* Contact Start */}
                <div className="contact">
                    <div className="container">
                        <div className="contact-img" style={{ filter: 'blur(3px)' }}>
                            <img src="img/contact.jpg" alt="Image" />
                        </div>
                        <div className="contact-form" style={{ marginTop: '-350px' }}>
                            <form onSubmit={handleSubmit}>
                                <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="orphanage_name"
                                        placeholder="Name"
                                        value={formData.orphanage_name}
                                        onChange={handleChange}
                                    />
                                    {errors.orphanage_name && <p className="help-block text-danger">{errors.orphanage_name}</p>}
                                </div>
    
                                <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <p className="help-block text-danger">{errors.email}</p>}
                                </div>
    
                                <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mobile"
                                        placeholder="Mobile"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                    />
                                    {errors.mobile && <p className="help-block text-danger">{errors.mobile}</p>}
                                </div>
                                <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="upi"
                                        placeholder="Upi"
                                        value={formData.upi}
                                        onChange={handleChange}
                                    />
                                    {errors.upi && <p className="help-block text-danger">{errors.upi}</p>}
                                </div>
    
                                <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        placeholder="Address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                    {errors.address && <p className="help-block text-danger">{errors.address}</p>}
                                </div>
    
                                {/* <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <input
                                        type="file"
                                        id="orphanage_images"
                                        name="orphanage_images"
                                        style={{ display: 'none' }}
                                        onChange={handleFileChange}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => document.getElementById('orphanage_images').click()}
                                    >
                                        Upload Image
                                    </button>
                                    {errors.orphanage_images && <p className="help-block text-danger">{errors.orphanage_images}</p>}
                                </div> */}
    
                                <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && <p className="help-block text-danger">{errors.username}</p>}
                                </div>
    
                                <div className="control-group" style={{ paddingTop: '10px' }}>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <p className="help-block text-danger">{errors.password}</p>}
                                </div>
    
                                <div style={{ paddingTop: '10px' }}>
                                    <button
                                        className="btn btn-custom"
                                        type="submit"
    
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* Contact End */}
    
                {/* Footer Start */}
                <Footer />
                {/* Footer End */}
    
                {/* Back to top button */}
                <a href="#" className="back-to-top">
                    <i className="fa fa-chevron-up" />
                </a>
            </>
  )
}
