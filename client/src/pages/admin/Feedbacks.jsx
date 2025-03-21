import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import NavBar from '../../components/navbar/NavBar';
import Footer from '../../components/navbar/Footer';
import Swal from 'sweetalert2'
export default function Feedbacks() {
    const [allFeedbacks, setAllFeedbacks] = useState([]);
    console.log(allFeedbacks);

    const [login_id, setLogin_id] = useState(localStorage.getItem('loginId'));
    useEffect(() => {
        axios.get(`http://localhost:5000/api/rest/viewfeedback`)
            .then(res => {
                const role = localStorage.getItem('role')
                console.log(res);

                if (role == 'admin') {
                    setAllFeedbacks(res.data.data)
                } else if (role == 'user') {
                    const filterData = res.data.data.filter((item) => item.restaurantId.login_id === login_id);
                    setAllFeedbacks(filterData)
                } else {
                    setAllFeedbacks(res.data.data)
                }
            });
    }, [login_id])

    const deleteFeedback = (id) => {
        Swal.fire({
            title: "Do you want logout?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            axios.get(`http://localhost:5000/api/rest/delete_feedback/${id}`)
                .then(res => {
                    const filterData = allFeedbacks.filter((item) => item._id !== id);
                    setAllFeedbacks(filterData)
                    toast.success('Feedback Deleted Successfully')
                })
        });

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
            <div className="page-header">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h2>Feedback</h2>
                        </div>
                        <div className="col-12">
                            <a href="">Home</a>
                            <a href="">Feedbacks</a>
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


                            {allFeedbacks.map((feedback) => (
                                <div className="single-bio">
                                    <div className="single-bio-img">
                                        <i className='fa fa-user-circle fa-2x' style={{ fontSize: '50px' }} />
                                    </div>
                                    <div className="single-bio-text" style={{ position: 'relative' }}>
                                        <h3>{feedback.userLoginId?.username}</h3>
                                        <p>
                                            {feedback.feedbackText}
                                        </p><br />
                                        <button className='btn btn-custom btn-danger text-white' onClick={() => deleteFeedback(feedback._id)}>Delete</button>
                                        <p style={{ position: 'absolute', top: '0', right: '-450px' }}>{new Date(feedback.submittedAt).toLocaleDateString()} <br /> {new Date(feedback.submittedAt).toLocaleTimeString()}</p>

                                    </div>
                                </div>
                            ))}



                        </div>

                    </div>
                </div>
            </div>
            {/* Single Post End*/}
            {/* Footer Start */}
            <Footer />
            {/* Footer End */}
        </>
    )
}
