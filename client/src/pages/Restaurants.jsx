import React, { useEffect, useState } from 'react'
import NavBar from '../components/navbar/NavBar'
import Footer from '../components/navbar/Footer'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
export default function Restaurants() {
    const [restaurant, setRestaurant] = useState([])
    console.log(restaurant);

    const [role, setRole] = useState(localStorage.getItem('role'))
    useEffect(() => {
        axios.get('http://localhost:5000/api/auth/getrestaurant').then((res) => {
            setRestaurant(res.data.data)
        })
    }, [])
    const handleDelete = (id) => {
        axios.get(`http://localhost:5000/api/auth/delete_rest/${id}`).then((res) => {
            toast.success(res.data.Message)
        })
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
            <div className="page-header" style={{ paddingBottom: '10px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>Restaurants</h2>
                        </div>
                        <div className="col-12">
                            <a href="/">Home</a>
                            <a>Restaurants</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Page Header End */}
            {/* Event Start */}
            <div className="event">
                <div className="container">

                    <div className="row">
                        {restaurant.map((data) => (
                            <div className="col-lg-4">
                                <div className="event-item">
                                    <img src={data.restaurant_images[0]} alt="Image" />
                                    <div className="event-content">
                                        <div className="event-meta">
                                            <p>
                                                <i className="fa fa-calendar-alt" />
                                                01-Jan-45
                                            </p>
                                            <p>
                                                <i className="far fa-clock" />
                                                8:00 - 10:00
                                            </p>
                                            <p style={{ textWrap: 'auto' }}>
                                                <i className="fa fa-map-marker-alt" />
                                                {data?.address}
                                            </p>

                                        </div>
                                        <div className="event-text">
                                            <h3>{data?.restaurant_name}</h3>
                                            Rating <br />
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                let starType = "gray"; // Default gray star

                                                if (data?.averageRating >= star) {
                                                    starType = "gold"; // Fully filled star
                                                } else if (data?.averageRating >= star - 0.5) {
                                                    starType = "half"; // Half-filled star
                                                }

                                                return (
                                                    <span
                                                        key={star}
                                                        onClick={() => handleRatingClick(star)}
                                                        onMouseEnter={() => handleRatingHover(star)}
                                                        onMouseLeave={() => setHover(0)}
                                                        style={{
                                                            fontSize: "24px",
                                                            cursor: "pointer",
                                                            color: starType === "gold" ? "gold" : "gray",
                                                            position: "relative",
                                                            display: "inline-block",
                                                            width: "24px"
                                                        }}
                                                    >
                                                        {starType === "half" ? (
                                                            <>
                                                                <span style={{ position: "absolute", overflow: "hidden", width: "43%", color:'gold' }}>★</span>
                                                                <span style={{ color: "gray" }}>★</span>
                                                            </>
                                                        ) : (
                                                            "★"
                                                        )}
                                                    </span>
                                                );
                                            })}

                                            <p>
                                                {data?.description}
                                            </p>
                                            {role == 'admin' ?
                                                <a className="btn btn-custom btn-danger text-white"
                                                    onClick={() => handleDelete(data?._id)}
                                                >
                                                    Delete
                                                </a> : role == 'user' ?
                                                    <a className="btn btn-custom btn-primary text-white" href={`/single-rest/${data?._id}`}>
                                                        View
                                                    </a> : ''
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Event End */}
            {/* Footer Start */}
            <Footer />
            {/* Footer End */}
            {/* Back to top button */}
            <a href="#" className="back-to-top">
                <i className="fa fa-chevron-up" />
            </a>
            {/* Pre Loader */}

            {/* JavaScript Libraries */}
            {/* Contact Javascript File */}
            {/* Template Javascript */}
        </>

    )
}
