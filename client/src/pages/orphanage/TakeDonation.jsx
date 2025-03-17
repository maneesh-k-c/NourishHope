import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import NavBar from '../../components/navbar/NavBar';


export default function TakeDonation() {
    const [donations, setDonations] = useState([]);
    const [donationId, setDonationId] = useState('');
    const [donatedQuantity, setDonatedQuantity] = useState('');
    const [assignQuantity, setAssignQuantity] = useState('');
    const [orphanageRequest, setOrphanageRequest] = useState([]);
    const [foodType, setFoodType] = useState('');
    const [requestId, setRequestId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState('All');
    console.log(donations);
    
    const handleFoodType = (value) => {
        setFoodType(value);
    }
    console.log(donations, foodType, donationId, donatedQuantity, assignQuantity);

    const [login_id, setLogin_id] = useState(localStorage.getItem('loginId'));
    useEffect(() => {
        axios.get(`http://localhost:5000/api/rest/list_donations_orp`)
            .then(res => {
                setDonations(res.data.data)
            });
        axios.get(`http://localhost:5000/api/orphanage/all-requests/`)
            .then(res => {
                setOrphanageRequest(res.data.data)
            });
    }, [login_id])

    const handleDonation = (id) => {
        setRequestId(id);
        setShowModal(true);


    }

    const processDonation = (e) => {
        e.preventDefault();
        const data = {
            requestId: requestId,
            quantity: assignQuantity,
            orphanageLogin: localStorage.getItem('loginId'),
        }
        console.log(data);

        axios.put(`http://localhost:5000/api/user/take_donation/${donationId}`, data)
            .then(res => {
                console.log(res);
                toast.success(res.data.Message);
                setShowModal(false);
                window.location.reload();
            }).catch(err => {
                toast.error(err.response.data.Message)
            })
    }


    const handleAssign = (id) => {
        setDonationId(id)
    }
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
            <div className="page-header">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>Donations</h2>
                        </div>
                        <div className="col-12">
                            <a href="">Home</a>
                            <a href="">Donations</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Page Header End */}
            {/* Single Post Start*/}
            <div className="event">
                <div className="container">
                    <div className="single single-content" style={{ display: 'flex', justifyContent: 'center', paddingTop: '0px' }}>
                        <div class="single-tags" >
                            <a onClick={()=>{setType('All')}}>All</a>
                            <a onClick={()=>{setType('Non Veg')}}>Non Veg</a>
                            <a onClick={()=>{setType('Veg')}}>Veg</a>

                        </div>
                    </div>

                    <div className="row">
                        {!donations[0] ?
                            <h1>No Donations</h1>
                            :
                            donations.filter((donation) => donation.food_type === type || type === 'All').map((donation) => (
                                <div className="col-lg-6">
                                    <div className="event-item">

                                        <div className="event-content">
                                            <div className="event-meta">
                                                <p style={{ textWrap: 'auto' }}>
                                                    <i className="fa fa-user" />
                                                    {donation.user?.name}
                                                </p>
                                                <p style={{ textWrap: 'auto' }}>
                                                    <i className="fa fa-mobile-alt" />
                                                    {donation.user?.mobile}
                                                </p>
                                                <p style={{ textWrap: 'auto' }}>
                                                    <i className="far fa-envelope" />
                                                    {donation.user?.email}
                                                </p>

                                            </div>
                                            <div className="event-text">
                                                <h3>{donation.food_type}</h3>
                                                <p>
                                                    Items Donated : {donation.quantity}
                                                </p>
                                                <p>
                                                    Status : {donation.status}
                                                </p>
                                                <p>
                                                    Date: {new Date(donation.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                                                </p>

                                                <a className="btn btn-custom btn-primary text-white" onClick={() => { handleAssign(donation._id), handleFoodType(donation.food_type), setDonatedQuantity(donation.quantity), handleDonation(donation._id) }}>
                                                    Take Donation
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Single Post End*/}
            {/* Footer Start */}
            <div className="footer">
              


                {showModal && (
                    
                    <div
                        className="modal show d-flex align-items-center justify-content-center"
                        tabIndex="-1"
                        style={{
                            display: "block",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: 1050, // Ensures it appears above other content
                        }}
                    >
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content" style={{ borderRadius: "10px", overflow: "hidden" }}>
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">Accept</h5>
                                    <button
                                        type="button"
                                        className="btn-danger"
                                        onClick={() => setShowModal(false)}
                                        style={{ color: "red", fontSize: "18px" }}
                                    >
                                        <b style={{ color: 'black' }}>X</b>
                                    </button>
                                </div>

                                <div className="modal-body text-center p-4">
                                    <form onSubmit={processDonation}>
                                        <div className="form-group mb-3">
                                            <label htmlFor="donations" className="form-label fw-bold">Set Quantity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id="donations"
                                                name="donations"
                                                onChange={(e) => setAssignQuantity(e.target.value)}
                                                required
                                                min='0'
                                                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-success w-100">Submit</button>
                                    </form>
                                </div>


                            </div>
                        </div>
                    </div>

                )}



                <div className="container copyright">
                    <div className="row">
                        <div className="col-md-6">
                            <p>
                                © <a href="#">Your Site Name</a>, All Right Reserved.
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p>
                                Designed By <a href="https://htmlcodex.com">HTML Codex</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer End */}
        </>
    )
}
