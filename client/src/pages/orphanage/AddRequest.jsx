import React, { useState } from 'react';
import NavBar from '../../components/navbar/NavBar';
import Footer from '../../components/navbar/Footer';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
export default function AddRequest() {
    const [formData, setFormData] = useState({
        login_id: localStorage.getItem('loginId'),
        quantity: '',
        description: '',
        food_type: '',
    });

    console.log(formData);


    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const validateForm = () => {
        const newErrors = {};

        if (!formData.quantity) {
            newErrors.quantity = 'Quantity is required';
        }
        if (!formData.food_type) {
            newErrors.food_type = 'Type is required';
        }
        if (!formData.description) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            axios.post('http://localhost:5000/api/orphanage/add-request', formData).then((res) => {
                console.log(res);
                toast.success('Request added successfully');
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
                            <h2>Make Requests</h2>
                        </div>
                        <div className="col-12">
                            <a href="">Home</a>
                            <a href="">Make Request</a>
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
                                <select name="food_type" id="" onChange={handleChange} className="form-control">
                                    <option value="">Choose food type</option>
                                    <option value="non-veg">Non Veg</option>
                                    <option value="veg">Veg</option>
                                </select>

                                {errors.orphanage_name && <p className="help-block text-danger">{errors.orphanage_name}</p>}
                            </div>

                            <div className="control-group" style={{ paddingTop: '10px' }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="quantity"
                                    placeholder="Quantity"
                                    value={formData.quantity}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === '' || /^[1-9]\d*$/.test(value)) {
                                            handleChange(e);
                                        }
                                    }}
                                />
                                {errors.quantity && <p className="help-block text-danger">{errors.quantity}</p>}
                            </div>
                            <div className="control-group" style={{ paddingTop: '10px' }}>
                                <textarea onChange={handleChange} name="description" id=""className="form-control" placeholder='Description'></textarea>
                               
                                {errors.description && <p className="help-block text-danger">{errors.description}</p>}
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
