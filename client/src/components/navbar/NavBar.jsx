import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
export default function NavBar() {

    const [role, setRole] = useState(localStorage.getItem('role'))
    console.log(role);
    //
    const logOut = () => {
        Swal.fire({
            title: "Do you want logout?",
            showDenyButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `No`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                localStorage.clear()
                window.location.href = '/'
            } 
        });

    }
    const [listDonations, setListDonations] = useState([])
    console.log(listDonations);

    console.log(listDonations.filter((item) => item?.orphanage_id?.some((data) => data?.status === 0)).length);



    useEffect(() => {
        const login_id = localStorage.getItem('loginId')
        axios.get(`http://localhost:5000/api/rest/list_donations_user/${login_id}`).then((res) => {
            setListDonations(res.data.data)
        })
    }, [])
    const changeStatus = () => {
        console.log('looo');
        const login_id = localStorage.getItem('loginId')
        axios.put(`http://localhost:5000/api/rest/update_donations/${login_id}`).then((res) => {
            console.log('updated');

        })
        window.location.href = '/view-donation-history'
    }

    return (
        <>
            {role == 'user' ?

                <div className="navbar navbar-expand-lg bg-dark navbar-dark">
                    <div className="container-fluid">
                        <a href="index.html" className="navbar-brand">
                            Nourish Hope
                        </a>
                        <button
                            type="button"
                            className="navbar-toggler"
                            data-toggle="collapse"
                            data-target="#navbarCollapse"
                        >
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div
                            className="collapse navbar-collapse justify-content-between"
                            id="navbarCollapse"
                        >
                            <div className="navbar-nav ml-auto">
                                <a href="/" className="nav-item nav-link active">
                                    Home
                                </a>
                                <a href="/restaurants" className="nav-item nav-link">
                                    Restaurants
                                </a>
                                <a onClick={changeStatus} style={{ position: 'relative' }} className="nav-item nav-link">
                                    Donations
                                    {listDonations.filter((item) => item?.orphanage_id?.some((data) => data?.status === 0)).length > 0 ?
                                        <span style={{
                                            position: 'absolute',
                                            top: '0',
                                            right: '0',
                                            backgroundColor: 'red',
                                            borderRadius: '30%',
                                            width: '20px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'end',
                                            padding: '2px',
                                        }}>{listDonations.filter((item) => item?.orphanage_id?.some((data) => data?.status === 0)).length}</span> : null
                                    }

                                </a>
                                {/* <a href="/notification" style={{position:'relative'}} className="nav-item nav-link">
                                    Notification <span style={{
                                        position:'absolute',
                                        top:'0',
                                        right:'0',
                                        backgroundColor:'red', 
                                        borderRadius:'30%',
                                        width:'20px',
                                        display:'flex',
                                        justifyContent:'center',
                                        alignItems:'end',
                                        padding:'2px',
                                        }}>10</span>
                                </a> */}
                                <a href="/profile" className="nav-item nav-link">
                                    Profile
                                </a>
                                {/* <a href="event.html" className="nav-item nav-link">
                                    Notifications
                                </a> */}


                                <a onClick={logOut} className="nav-item nav-link">
                                    Logout
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                : role == "admin" ?

                    <div className="navbar navbar-expand-lg bg-dark navbar-dark">
                        <div className="container-fluid">
                            <a href="/" className="navbar-brand">
                            NOURISH HOPE
                            </a>
                            <button
                                type="button"
                                className="navbar-toggler"
                                data-toggle="collapse"
                                data-target="#navbarCollapse"
                            >
                                <span className="navbar-toggler-icon" />
                            </button>
                            <div
                                className="collapse navbar-collapse justify-content-between"
                                id="navbarCollapse"
                            >
                                <div className="navbar-nav ml-auto">
                                    <a href="/" className="nav-item nav-link active">
                                        Home
                                    </a>
                                    <div className="nav-item dropdown">
                                        <a
                                            href="#"
                                            className="nav-link dropdown-toggle"
                                            data-toggle="dropdown"
                                        >
                                            Orphanage
                                        </a>
                                        <div className="dropdown-menu">
                                            <a href="/add-orphanages" className="dropdown-item">
                                                Add Orphanage
                                            </a>
                                            <a href="/orphanages" className="dropdown-item">
                                                View Orphanage
                                            </a>

                                        </div>
                                    </div>
                                    <div className="nav-item dropdown">
                                        <a
                                            href="#"
                                            className="nav-link dropdown-toggle"
                                            data-toggle="dropdown"
                                        >
                                            Restaurant
                                        </a>
                                        <div className="dropdown-menu">
                                            <a href="/restaurants" className="dropdown-item">
                                                View Restaurants
                                            </a>
                                        </div>
                                    </div>
                                    <a href="/feedback" className="nav-item nav-link">
                                        Feedback
                                    </a>


                                    <a onClick={logOut} className="nav-item nav-link">
                                        Logout
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    : role == 'orphanage' ?

                        <div className="navbar navbar-expand-lg bg-dark navbar-dark">
                            <div className="container-fluid">
                                <a href="index.html" className="navbar-brand">
                                    NOURISH HOPE
                                </a>
                                <button
                                    type="button"
                                    className="navbar-toggler"
                                    data-toggle="collapse"
                                    data-target="#navbarCollapse"
                                >
                                    <span className="navbar-toggler-icon" />
                                </button>
                                <div
                                    className="collapse navbar-collapse justify-content-between"
                                    id="navbarCollapse"
                                >
                                    <div className="navbar-nav ml-auto">
                                        <a href="/" className="nav-item nav-link active">
                                            Home
                                        </a>
                                        <div className="nav-item dropdown">
                                            <a
                                                href="#"
                                                className="nav-link dropdown-toggle"
                                                data-toggle="dropdown"
                                            >
                                                Manage Requests
                                            </a>
                                            <div className="dropdown-menu">
                                                <a href="/add-request" className="dropdown-item">
                                                    Make Request
                                                </a>
                                                <a href="/view-requests" className="dropdown-item">
                                                    View Request
                                                </a>

                                            </div>
                                        </div>
                                        <a href="/take-donation" className="nav-item nav-link active">
                                            Take Donation
                                        </a>
                                        {/* <a href="/feedback" className="nav-item nav-link active">
                                            Feedbacks
                                        </a> */}

                                        <a href="/profile" className="nav-item nav-link">
                                            Profile
                                        </a>

                                        <a onClick={logOut} className="nav-item nav-link">
                                            Logout
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div> : role == 'restaurant' ?

                            <div className="navbar navbar-expand-lg bg-dark navbar-dark">
                                <div className="container-fluid">
                                    <a href="index.html" className="navbar-brand">
                                    NOURISH HOPE
                                    </a>
                                    <button
                                        type="button"
                                        className="navbar-toggler"
                                        data-toggle="collapse"
                                        data-target="#navbarCollapse"
                                    >
                                        <span className="navbar-toggler-icon" />
                                    </button>
                                    <div
                                        className="collapse navbar-collapse justify-content-between"
                                        id="navbarCollapse"
                                    >
                                        <div className="navbar-nav ml-auto">
                                            <a href="/" className="nav-item nav-link ">
                                                Home
                                            </a>
                                            <a href="/view-donations-restarant" className="nav-item nav-link ">
                                                Donations
                                            </a>
                                            <a href="/view-request-restaurant" className="nav-item nav-link ">
                                                Requests
                                            </a>
                                            <a href="/feedback" className="nav-item nav-link ">
                                                Feedbacks
                                            </a>

                                            <a href="/profile" className="nav-item nav-link">
                                                Profile
                                            </a>

                                            <a onClick={logOut} className="nav-item nav-link">
                                                Logout
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div> :
                            <div className="navbar navbar-expand-lg bg-dark navbar-dark">
                                <div className="container-fluid">
                                    <a href="index.html" className="navbar-brand">
                                    NOURISH HOPE
                                    </a>
                                    <button
                                        type="button"
                                        className="navbar-toggler"
                                        data-toggle="collapse"
                                        data-target="#navbarCollapse"
                                    >
                                        <span className="navbar-toggler-icon" />
                                    </button>
                                    <div
                                        className="collapse navbar-collapse justify-content-between"
                                        id="navbarCollapse"
                                    >
                                        <div className="navbar-nav ml-auto">
                                            <a href="/" className="nav-item nav-link active">
                                                Home
                                            </a>

                                            <a href="/register" className="nav-item nav-link">
                                                Sign Up
                                            </a>

                                            <a href="/login" className="nav-item nav-link">
                                                Sign In
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

            }
        </>
    )
}
