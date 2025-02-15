import React, { useEffect, useState } from 'react'
import NavBar from '../components/navbar/NavBar'
import axios from 'axios'
import Footer from '../components/navbar/Footer'
import './profile.css'

export default function Profile() {
    const [role, setRole] = useState(localStorage.getItem('role'))
    const [profile, setProfile] = useState({})
    const [donation, setDonation] = useState()
    const [food, setFood] = useState()
    console.log(profile,donation,food);
    console.log(role);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/auth/getProfile/${localStorage.getItem('loginId')}/${role}`).then((res) => {
            setProfile(res.data.data)
        })
        
        axios.get(`http://localhost:5000/api/user/user-donation/${localStorage.getItem('loginId')}`).then((res) => {
            setDonation(res.data)
        })
        axios.get(`http://localhost:5000/api/user/user-food-donation/${localStorage.getItem('loginId')}`).then((res) => {
            setFood(res.data)
        })
    }, [role])
    return (
        <>
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
                            <h2>Profile</h2>
                        </div>
                        <div className="col-12">
                            <a href="/">Home</a>
                            <a href="">profile</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Page Header End */}
            {/* Single Post Start*/}
            <div class="team">
                <div class="container">

                    <div className="container d-flex justify-content-center">
                        <div className="card-profile">
                            <div className="top-container-profile">
                                <img
                                    src={
                                        role == 'restaurant'
                                            ? profile?.restaurant_images?.[0]
                                            : role === 'orphanage' ? profile?.orphanage_images?.[0] : profile?.images?.[0]
                                    }

                                    className="profile-image-profile"
                                    width={250}
                                    height={250}
                                />
                                <div className="row" style={{ width: '100%' }}>
                                    <div className="col-lg-8">
                                        <div className="ml-3">
                                            <h5 className="name-profile">{role == 'user' ? profile?.name?.toUpperCase() : profile?.restaurant_name?.toUpperCase()}</h5>
                                            <p className="mail-profile" style={{ marginBottom: '0px' }}>{profile?.email}</p>
                                            <p className="mail-profile" style={{ marginBottom: '0px' }}>+91{profile?.mobile}</p>
                                            <p className="mail-profile">Username: {role == 'user' ? profile?.login_id?.username : profile?.address}</p>
                                            <p className="mail-profile">Address: {role == 'restaurant' ? profile?.address :''}</p>
                                        </div>
                                    </div>
                                    <div className="col-lg-4" style={{ justifyContent: 'center', }}>
                                        {role == 'orphanage' ?

                                            <a className='btn btn-primary' style={{ width: '60%', margin: '30px 0px', float: 'right' }} href={role == 'orphanage' ? '/update-orphanage' : ''}>Edit</a>
                                            : role == 'user'?
                                            <a className='btn btn-primary' style={{ width: '60%', margin: '30px 0px', float: 'right' }} href={role == 'user' ? '/update-user' : ''}>Edit</a>
                                            :
                                            <a className='btn btn-primary' style={{ width: '60%', margin: '30px 0px', float: 'right' }} href={role == 'restaurant' ? '/update-rest' : ''}>Edit</a>
                                            }


                                    </div>
                                </div>
                            </div>
                          {role=='user'?
                          <>
                          <div className="middle-container-profile d-flex  align-items-center mt-3 p-2">
                          <div className="dollar-div-profile px-3">
                              <div className="round-div-profile">
                                  &#8377;
                              </div>
                          </div>
                          <div className=" mr-2">
                              <div className="col-lg-12">
                                  <span className="current-balance-profile">Total Cash Donations</span>
                                  <span className="amount-profile">
                                      <span className="dollar-sign-profile">&nbsp;&nbsp;&nbsp; </span>{donation?.totalDonations}
                                  </span>
                              </div>
                              <div className="col-lg-12">
                                  <span className="current-balance-profile">Total Cash Donated</span>
                                  <span className="amount-profile">
                                      <span className="dollar-sign-profile">&nbsp;&nbsp;&nbsp; &#8377;</span>{donation?.totalAmount}
                                  </span>
                              </div>

                          </div>
                      </div>
                      <div className="middle-container-profile d-flex  align-items-center mt-3 p-2">
                          <div className="dollar-div-profile px-3">
                              <div className="round-div-profile">
                                  &#8377;
                              </div>
                          </div>
                          <div className=" mr-2">
                              <div className="col-lg-12">
                                  <span className="current-balance-profile">Total Food Donated</span>
                                  <span className="amount-profile">
                                      <span className="dollar-sign-profile">&nbsp;&nbsp;&nbsp; </span>{food?.totalDonations}
                                  </span>
                              </div>
                              <div className="col-lg-12">
                                  <span className="current-balance-profile">Total Donated Food Quantity</span>
                                  <span className="amount-profile">
                                      <span className="dollar-sign-profile">&nbsp;&nbsp;&nbsp;</span>{food?.totalQuantity}
                                  </span>
                              </div>

                          </div>
                      </div>
                      </>
                      :''  
                        }


                        </div>
                    </div>


                </div>
            </div>
            {/* Single Post End*/}
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
