import React, { useEffect, useState } from 'react'
import NavBar from '../../components/navbar/NavBar'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import QRCode from 'react-qr-code';
export default function SingleRestaurant() {
    const { id } = useParams()
    const [donations, setDonations] = useState('');
    const [food_type, setfood_type] = useState('');
    const [upiId, setUpiId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [restaurant, setRestaurant] = useState([])
    console.log(restaurant);
    const [feedback, setFeedback] = useState("");
    const [feedbackError, setFeedbackError] = useState("");

    const [allFeedbacks, setAllFeedbacks] = useState([]);
    console.log(upiId);
    const donationAmount = donations * 100; // Fixed donation per unit
    const upiUrl = `upi://pay?pa=${upiId}&pn=${restaurant}&am=${donationAmount}&cu=INR`;

    const handleFeedbackChange = (e) => {
        setFeedback(e.target.value);
        if (e.target.value.trim() === "") {
            setFeedbackError("Feedback cannot be empty.");
        } else {
            setFeedbackError("");
        }
    };
    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (feedback.trim() === "") {
            setFeedbackError("Feedback cannot be empty.");
        } else {
            setFeedbackError("");
            const login_id = localStorage.getItem("login_id");
            axios.post(`http://localhost:5000/api/rest/submitfeedback`, { feedbackText: feedback, userLoginId: localStorage.getItem("loginId"), restaurantId: id }).then(res => {
                toast.success(res.data.message);
                setFeedback("");
            }).catch((err) => {
                console.log(err);

                toast.error('Error submitting feedback')
            })
            // Reset feedback field
        }
    };

    const handleDonationSubmit = (e) => {
        e.preventDefault();
        if (!donations || donations <= 0) {
            alert("Please select a restaurant and enter a valid donation amount.");
            return;
        }
        if (!food_type ) {
            alert("Please select a food type");
            return;
        }
        setShowModal(true);
        const formData = {
            login_id: localStorage.getItem("loginId"),
            restaurant_id: id,
            food_type:food_type,
            quantity: donations
        }
        axios.post("http://localhost:5000/api/user/make_donation", formData).then((res) => {
            console.log(res.data);
        })
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/api/rest/viewfeedback`)
            .then(res => {
                const filterData = res.data.data.filter((item) => item.restaurantId?._id == id);
                setAllFeedbacks(filterData)
            });
    }, [feedback])

    useEffect(() => {
        axios.get(`http://localhost:5000/api/rest/singel-rest/${id}`).then((res) => {
            setRestaurant(res.data.data)
            setUpiId(res.data.data.upi)
        })
    }, [id])
    return (
        <>
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
                                        <p>+123 456 7890</p>
                                    </div>
                                    <div className="text">
                                        <i className="fa fa-envelope" />
                                        <p>info@example.com</p>
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
                                <h2 style={{ textTransform: 'uppercase' }}>{restaurant?.restaurant_name}</h2>
                            </div>
                            <div className="col-12">
                                <a href="">Home</a>
                                <a href="">Detail</a>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Page Header End */}
                {/* Single Post Start*/}
                <div className="single">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="single-content">
                                    <img src={restaurant?.restaurant_images?.length > 0 ? restaurant.restaurant_images[0] : 'fallback-image.jpg'} />
                                    <h2>Lorem ipsum dolor sit amet</h2>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                                        molestie, lorem eu eleifend bibendum, augue purus mollis sapien,
                                        non rhoncus eros leo in nunc. Donec a nulla vel turpis consectetur
                                        tempor ac vel justo. In hac habitasse platea dictumst. Cras nec
                                        sollicitudin eros. Nunc eu enim non turpis sagittis rhoncus
                                        consectetur id augue. Mauris dignissim neque felis. Phasellus
                                        mollis mi a pharetra cursus. Maecenas vulputate augue placerat
                                        lacus mattis, nec ornare risus sollicitudin.
                                    </p>



                                </div>

                                {allFeedbacks.map((feedback) => (
                                    <div className="single-bio">
                                        <div className="single-bio-img">
                                            <i className='fa fa-user-circle fa-2x' style={{ fontSize: '50px' }} />
                                        </div>
                                        <div className="single-bio-text" style={{ position: 'relative' }}>
                                            <h3>{feedback.userLoginId?.username}</h3>
                                            <p>
                                                {feedback.feedbackText}
                                            </p>
                                            <p style={{ position: 'absolute', top: '0', right: '-400px' }}>{new Date(feedback.submittedAt).toLocaleDateString()} <br /> {new Date(feedback.submittedAt).toLocaleTimeString()}</p>

                                        </div>
                                    </div>
                                ))}



                            </div>
                            <div className="col-lg-4">
                                <div className="sidebar">


                                    <div className="sidebar-widget">
                                        <h2 className="widget-title">Address</h2>
                                        <div className="text-widget">
                                            <p>
                                                {restaurant?.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="sidebar-widget">
                                        <h2 className="widget-title">Details</h2>
                                        <div className="text-widget">
                                            <p>
                                                +91 {restaurant?.mobile}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="sidebar-widget">
                                        <h2 className="widget-title">Donate</h2>
                                        <div className="donate-form">
                                            <form onSubmit={handleDonationSubmit}>

                                                <div className="control-group mb-3">
                                                    <select
                                                        className="form-control"
                                                        value={food_type}
                                                        onChange={(e)=>{setfood_type(e.target.value)}}
                                                    >
                                                        <option value="">Select Food Type</option>
                                                        <option style={{ color: 'black' }} value="Non Veg">Non veg</option>
                                                        <option style={{ color: 'black' }} value="Veg">Veg</option>


                                                    </select>
                                                </div>
                                                <div className="control-group mb-3">
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="No of donations"
                                                        value={donations}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || /^[1-9]\d*$/.test(value)) {
                                                                setDonations(value);
                                                            }
                                                        }}

                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <button className="btn btn-custom " type="submit">
                                                        Donate Now
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="sidebar-widget">
                                        <h2 className="widget-title">Add Feedback</h2>
                                        <div className="search-widget">
                                            <form onSubmit={handleFeedbackSubmit}>
                                                {feedbackError && <small className="text-danger">{feedbackError}</small>}
                                                <textarea className="form-control"
                                                    onChange={handleFeedbackChange}
                                                    name="feedbackText" id=""></textarea>

                                                <input
                                                    type="submit"
                                                    defaultValue="Post Comment"
                                                    className=" btn-primary"
                                                    value={"Post Feedback"}
                                                    style={{ marginTop: '10px' }}
                                                />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Modal */}
                {showModal && (
                    <div
                        className="modal show"
                        tabIndex="-1"
                        style={{
                            display: "block",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Donate via UPI</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>
                                <div className="modal-body text-center">
                                    {upiId ? (
                                        <>
                                            <p>
                                                Scan the QR code below or use a UPI app to make your
                                                donation.
                                            </p>
                                            <QRCode value={upiUrl} size={200} />
                                            <p className="mt-3">
                                                <strong>Amount:</strong> ₹{donationAmount}
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-danger">No UPI ID available.</p>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Single Post End*/}
                {/* Footer Start */}
                <div className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3 col-md-6">
                                <div className="footer-contact">
                                    <h2>Our Head Office</h2>
                                    <p>
                                        <i className="fa fa-map-marker-alt" />
                                        123 Street, New York, USA
                                    </p>
                                    <p>
                                        <i className="fa fa-phone-alt" />
                                        +012 345 67890
                                    </p>
                                    <p>
                                        <i className="fa fa-envelope" />
                                        info@example.com
                                    </p>
                                    <div className="footer-social">
                                        <a className="btn btn-custom" href="">
                                            <i className="fab fa-twitter" />
                                        </a>
                                        <a className="btn btn-custom" href="">
                                            <i className="fab fa-facebook-f" />
                                        </a>
                                        <a className="btn btn-custom" href="">
                                            <i className="fab fa-youtube" />
                                        </a>
                                        <a className="btn btn-custom" href="">
                                            <i className="fab fa-instagram" />
                                        </a>
                                        <a className="btn btn-custom" href="">
                                            <i className="fab fa-linkedin-in" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="footer-link">
                                    <h2>Popular Links</h2>
                                    <a href="">About Us</a>
                                    <a href="">Contact Us</a>
                                    <a href="">Popular Causes</a>
                                    <a href="">Upcoming Events</a>
                                    <a href="">Latest Blog</a>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="footer-link">
                                    <h2>Useful Links</h2>
                                    <a href="">Terms of use</a>
                                    <a href="">Privacy policy</a>
                                    <a href="">Cookies</a>
                                    <a href="">Help</a>
                                    <a href="">FQAs</a>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <div className="footer-newsletter">
                                    <h2>Newsletter</h2>
                                    <form>
                                        <input className="form-control" placeholder="Email goes here" />
                                        <button className="btn btn-custom">Submit</button>
                                        <label>Don't worry, we don't spam!</label>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
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

        </>
    )
}
