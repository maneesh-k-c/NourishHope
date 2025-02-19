import axios from "axios";
import React, { useEffect, useState } from "react";
import QRCode from 'react-qr-code';
import Swal from 'sweetalert2'

export default function DonateNow() {
    const [restaurant, setRestaurant] = useState("");
    const [donations, setDonations] = useState('');
    const [food_type, setFoodtype] = useState('');
    const [upiId, setUpiId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [restaurantData, setRestaurantData] = useState([]);
    console.log(restaurantData);

    useEffect(() => {
        axios.get("http://localhost:5000/api/auth/getrestaurant").then((res) => {
            setRestaurantData(res.data.data);
        })
    }, [])


    const handleRestaurantChange = (e) => {
        const selectedRestaurant = e.target.value;
        const filter = restaurantData.filter((item) => item._id === selectedRestaurant);
        setRestaurant(selectedRestaurant);
        setUpiId(filter[0].upi || "");
    };
    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setFoodtype(selectedType);
    };

    const handleDonationSubmit = (e) => {
        e.preventDefault();
        if (!restaurant || !donations || donations <= 0) {
            alert("Please select a restaurant and enter a valid donation amount.");
            return;
        }
        setShowModal(true);
        const formData = {
            login_id: localStorage.getItem("loginId"),
            restaurant_id: restaurant,
            food_type: food_type,
            quantity: donations
        }
        axios.post("http://localhost:5000/api/user/make_donation", formData).then((res) => {
            console.log(res.data);
            setDonations('')
            setRestaurant('')
            setFoodtype('')
        })
        
    };

    const donationAmount = donations * 100; // Fixed donation per unit
    const upiUrl = `upi://pay?pa=${upiId}&pn=${restaurant}&am=${donationAmount}&cu=INR`;

    const confirmation = () => {
        setShowModal(false)
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Payment completed!",
        });
    }

    return (
        <div
            className="donate"
            id="donate-now"
            data-parallax="scroll"
            data-image-src="img/donate.jpg"
        >
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg-7">
                        <div className="donate-content">
                            <div className="section-header">
                                <p>Donate Now</p>
                                <h2>Let's donate to needy people for better lives</h2>
                            </div>
                            <div className="donate-text">
                                {/* <p>
                                    Lorem ipsum dolor sit amet elit. Phasellus nec pretium mi.
                                    Curabitur facilisis ornare velit non. Aliquam metus tortor,
                                    auctor id gravida, viverra quis sem. Curabitur non nisl nec nisi
                                    maximus. Aenean convallis porttitor. Aliquam interdum at lacus
                                    non blandit.
                                </p> */}
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="donate-form">
                            <form onSubmit={handleDonationSubmit}>
                                <div className="control-group">
                                    <select
                                        className="form-control"
                                        value={restaurant}
                                        onChange={handleRestaurantChange}
                                    >
                                        <option value="">Select Restaurant</option>
                                        {restaurantData.map((restaurant) => (
                                            <option style={{ color: 'black' }} value={restaurant._id}>{restaurant.restaurant_name}</option>
                                        ))}

                                    </select>

                                </div>
                                <div className="control-group">
                                    <select
                                        className="form-control"
                                        value={food_type}
                                        onChange={handleTypeChange}
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
                                        max="500"
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (value === '' || /^[1-9]\d*$/.test(value)) {
                                                if (value >= 499) value = 500;
                                                if (value < 0) value = '';
                                                if (!value) value = '';
                                                setDonations(value)
                                            }
                                        }}

                                        required
                                    />
                                </div>

                                <div>
                                    <button className="btn btn-custom btn-primary" type="submit">
                                        Donate Now
                                    </button>
                                </div>
                            </form>
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
                                    onClick={() => confirmation()}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    )
}
