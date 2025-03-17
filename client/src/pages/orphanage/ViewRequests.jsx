import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navbar/NavBar';
import Footer from '../../components/navbar/Footer';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';


export default function ViewRequests() {

    const [requests, setRequests] = useState([]);
    console.log(requests);

    useEffect(() => {
        const login = localStorage.getItem('loginId');
        axios.get(`http://localhost:5000/api/orphanage/all-requests/${login}`).then(res => {
            setRequests(res.data.data);
        }
        )
    }, [])

    const deleteRequest = (id) => {
        axios.delete(`http://localhost:5000/api/orphanage/requests/${id}`).then(res => {
            toast.success('Request Canceled Successfully');
            const filter = requests.filter((request) => request._id !== id);
            setRequests(filter);
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
                            <h2>View Requests</h2>
                        </div>
                        <div className="col-12">
                            <a href="">Home</a>
                            <a href="">View Requests</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Page Header End */}



            <div className="causes">
                <div className="container">
                    <div className="row">
                        {!requests[0] ?
                            <h1 style={{
                                marginTop: '20px',
                                marginBottom: '20px', textAlign: 'center', width: '100%'
                            }} >No request Found</h1>
                            :
                            requests.map((request) => {
                                // Calculate percentage for the progress bar
                                const percentage = Math.min(
                                    (parseFloat(request.donations) / parseFloat(request.requested_quantity)) * 100,
                                    100
                                );

                                // Format date to dd:mm:yy
                                const formattedDate = new Date(request.date).toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                });

                                return (
                                    <div className="col-lg-4 col-md-6" key={request._id}>
                                        <div className="causes-item" style={{ position: 'relative' }}>
                                            {/* Date displayed at the top-right corner */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    backgroundColor: '#f8f9fa',
                                                    padding: '5px 10px',
                                                    borderRadius: '5px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold',
                                                    color: '#6c757d',
                                                }}
                                            >
                                                {formattedDate}
                                            </div>

                                            <div className="causes-progress">
                                                <div className="progress">
                                                    <div
                                                        className="progress-bar"
                                                        role="progressbar"
                                                        aria-valuenow={percentage}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                        style={{ width: `${percentage}%` }}
                                                    >
                                                        <span>{Math.round(percentage)}%</span>
                                                    </div>
                                                </div>
                                                <div className="progress-text">
                                                    <p>
                                                        <strong>Donations:</strong> {request.donations}
                                                    </p>
                                                    <p>
                                                        <strong>Goal:</strong> {request.requested_quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="causes-text">
                                                <h3>{request.food_type}</h3>
                                                <p>{request.description}</p>
                                            </div>
                                            <div className="causes-btn justify-content-center">
                                                <a className="btn btn-danger" onClick={() => { deleteRequest(request._id) }}>Cancel Request</a>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div >





            {/* Footer Start */}
            < Footer />
            {/* Footer End */}

            {/* Back to top button */}
            <a href="#" className="back-to-top">
                <i className="fa fa-chevron-up" />
            </a>
        </>
    )
}
