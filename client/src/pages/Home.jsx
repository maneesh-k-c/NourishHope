import React, { useState, useEffect } from 'react'
import QRCode from 'react-qr-code';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import OwlCarousel from 'react-owl-carousel';
import axios from 'axios'
import NavBar from '../components/navbar/NavBar';
import DonateNow from '../components/donate/DonateNow';
import Footer from '../components/navbar/Footer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
export default function Home() {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [orpDonationId, setOrpDonationId] = useState('');
  const [DonationAmount, setDonationAmount] = useState(1);
  const [upi, setUpi] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const navigate = useNavigate();
  const checkLogin = () => {
    if (localStorage.getItem('loginId') === null) {
      navigate('/login');
    }
  }
  console.log(DonationAmount, orpDonationId, upi);
  const saveDonation = () => {
    const data = {
      orphanage_id: orpDonationId,
      amount: DonationAmount,
      login_id: localStorage.getItem('loginId'),
    }
    axios.post('http://localhost:5000/api/user/add-donation', data).then((res) => {
      console.log(res.data.data)
    })
  }

  const handleDonation = (id) => {
    setOrpDonationId(id);
    setShowDonationModal(true);
  }
  const [collection, setCollection] = useState({})
  console.log(collection);

  const options = {
    loop: true,
    margin: 10,
    nav: true,
    dots: true,
    items: 1, // Change to number of items you want to show
  };
  const [restaurant, setRestaurant] = useState([])
  console.log(restaurant);

  const [role, setRole] = useState(localStorage.getItem('role'))
  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/getrestaurant').then((res) => {
      setRestaurant(res.data.data)
    })
  }, [])
  const [orphanages, setOrphanages] = useState([])
  console.log('orphanages', orphanages);
  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/getorphanage').then((res) => {
      setOrphanages(res.data.data)
    })
    axios.get('http://localhost:5000/api/user/collections').then((res) => {
      setCollection(res.data.data)
    })
  }, [])
  const confirmation = () => {
    setShowQrModal(false)
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Payment completed!",
    });
  }

  return (
    <>
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
        {/* Carousel Start */}
        <div className="carousel">
          <div
            className=""
          >
            <OwlCarousel className="owl-carousel" {...options}>
              <div className="carousel-item">
                <div className="carousel-img">
                  <img src={"/img/carousel-1.jpg"} alt="Image" />
                </div>
                <div className="carousel-text">
                  <h1>Bridging generosity with those in need</h1>
                  <p>
                    Nourish Hope – Empowering Communities, One Meal at a Time
                    A seamless platform connecting donors with orphanages for a brighter future.
                  </p>
                  {role != 'admin' ?
                    <div className="carousel-btn">
                      <a className="btn btn-custom" href="#donate-now">
                        Donate Now
                      </a>

                    </div> : ''}
                </div>
              </div>

              <div className="carousel-item">
                <div className="carousel-img">
                  <img src="img/carousel-2.jpg" alt="Image" />
                </div>
                <div className="carousel-text">
                  <h1>Get Involved with helping hand</h1>
                  <p>
                    Morbi sagittis turpis id suscipit feugiat. Suspendisse eu augue
                    urna. Morbi sagittis, orci sodales varius fermentum, tortor
                  </p>
                  <div className="carousel-btn">
                    <a className="btn btn-custom" href="#donate-now">
                      Donate Now
                    </a>

                  </div>
                </div>
              </div>

              <div className="carousel-item">
                <div className="carousel-img">
                  <img src="img/carousel-3.jpg" alt="Image" />
                </div>
                <div className="carousel-text">
                  <h1>Bringing smiles to millions</h1>
                  <p>
                    Sed ultrices, est eget feugiat accumsan, dui nibh egestas tortor,
                    ut rhoncus nibh ligula euismod quam. Proin pellentesque odio
                  </p>
                  <div className="carousel-btn">
                    <a className="btn btn-custom" href="#donate-now">
                      Donate Now
                    </a>

                  </div>
                </div>
              </div>
            </OwlCarousel>
          </div>
        </div>
        {/* Carousel End */}
        {/* Video Modal Start*/}
        <div
          className="modal fade"
          id="videoModal"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
                {/* 16:9 aspect ratio */}
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe
                    className="embed-responsive-item"
                    src=""
                    id="video"
                    allowscriptaccess="always"
                    allow="autoplay"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Video Modal End */}
        {/* About Start */}
        <div className="about">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div
                  className="about-img"
                  data-parallax="scroll"
                  data-image-src="img/about.jpg"
                />
              </div>
              <div className="col-lg-6">
                <div className="section-header">
                  <p>About Us</p>
                  <h2>Worldwide non-profit charity organization</h2>
                </div>
                <div className="about-tab">
                  <ul className="nav nav-pills nav-justified">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-toggle="pill"
                        href="#tab-content-1"
                      >
                        About
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="pill"
                        href="#tab-content-2"
                      >
                        Mission
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="pill"
                        href="#tab-content-3"
                      >
                        Vision
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div id="tab-content-1" className="container tab-pane active">
                      At Nourish Hope, we believe that every orphan deserves a life of dignity, love, and opportunities. Our platform connects donors with orphanages, ensuring that food, financial aid, and essential resources reach those who need them the most.
                    </div>
                    <div id="tab-content-2" className="container tab-pane fade">
                      We partner with restaurants, businesses, and individuals to create a seamless donation experience, making giving back easier, transparent, and impactful. Through real-time tracking, secure transactions, and a user-friendly interface, we ensure that every contribution makes a difference.
                    </div>
                    <div id="tab-content-3" className="container tab-pane fade">
                      Founded with a vision to empower orphanages and inspire generosity, Nourish Hope is more than just a platform—it’s a movement. Join us in transforming lives, one donation at a time.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* About End */}
        {/* Service Start */}
        <div className="service">
          <div className="container">
            <div className="section-header text-center">
              <p>Why Choose Nourish Hope?</p>
              <h2>We believe that we can save more lifes with you</h2>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="service-item">
                  <div className="service-icon">
                    <i className="flaticon-diet" />
                  </div>
                  <div className="service-text">
                    {/* <h3>Healthy Food</h3> */}
                    <p>
                      Direct & Impactful Giving – Every donation goes directly to verified orphanages, ensuring your generosity reaches those who truly need it.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="service-item">
                  <div className="service-icon">
                    <i className="flaticon-water" />
                  </div>
                  <div className="service-text">
                    {/* <h3>Pure Water</h3> */}
                    <p>
                      Seamless & Transparent Process – Our user-friendly platform allows you to donate effortlessly while tracking your contributions in real time.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="service-item">
                  <div className="service-icon">
                    <i className="flaticon-healthcare" />
                  </div>
                  <div className="service-text">
                    {/* <h3>Health Care</h3> */}
                    <p>
                      Trusted Partnerships – We collaborate with reputable orphanages and businesses, guaranteeing reliability and accountability.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="service-item">
                  <div className="service-icon">
                    <i className="flaticon-education" />
                  </div>
                  <div className="service-text">
                    {/* <h3>Primary Education</h3> */}
                    <p>
                      Be a Part of Change – Your support doesn’t just provide essentials; it transforms lives, fostering a brighter future for orphans.
                    </p>
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-4 col-md-6">
                <div className="service-item">
                  <div className="service-icon">
                    <i className="flaticon-home" />
                  </div>
                  <div className="service-text">
                    <h3>Residence Facilities</h3>
                    <p>
                      Lorem ipsum dolor sit amet elit. Phase nec preti facils ornare
                      velit non metus tortor
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="service-item">
                  <div className="service-icon">
                    <i className="flaticon-social-care" />
                  </div>
                  <div className="service-text">
                    <h3>Social Care</h3>
                    <p>
                      Lorem ipsum dolor sit amet elit. Phase nec preti facils ornare
                      velit non metus tortor
                    </p>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        {/* Service End */}
        {/* Facts Start */}
        <div className="facts" data-parallax="scroll" data-image-src="img/facts.jpg">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="facts-item">
                  <i className="flaticon-home" />
                  <div className="facts-text">
                    <h3 className="facts-plus" data-toggle="counter-up">
                      {collection.orphanages}
                    </h3>
                    <p>Orphanages</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="facts-item">
                  <i className="flaticon-charity" />
                  <div className="facts-text">
                    <h3 className="facts-plus" data-toggle="counter-up">
                      {collection.users}
                    </h3>
                    <p>Users</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="facts-item">
                  <i className="flaticon-home" />
                  <div className="facts-text">
                    <h3 className="facts-dollar" data-toggle="counter-up">
                      {collection.restaurants}
                    </h3>
                    <p>Restaurants</p>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="facts-item">
                  <i className="flaticon-donation" />
                  <div className="facts-text">
                    <h3 className="facts-dollar" data-toggle="counter-up">
                      {collection.donation}
                    </h3>
                    <p>Donations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Facts End */}
        {/* Causes Start */}
        <div className="causes">
          <div className="container">
            <div className="section-header text-center">
              <p>Why Donate</p>
              <h2>Small acts of kindness can create a lifetime of change</h2>
            </div>
            <div className="owl-carousel causes-carousel">
              <div className="causes-item">
                <div className="causes-img">
                  <img src="img/causes-1.jpg" alt="Image" />
                </div>
                <div className="causes-progress">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={85}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span>85%</span>
                    </div>
                  </div>
                  <div className="progress-text">
                    <p>
                      <strong>Raised:</strong> $100000
                    </p>
                    <p>
                      <strong>Goal:</strong> $50000
                    </p>
                  </div>
                </div>
                <div className="causes-text">
                  <h3>Lorem ipsum dolor sit</h3>
                  <p>
                    Lorem ipsum dolor sit amet elit. Phasell nec pretium mi. Curabit
                    facilis ornare velit non vulputa
                  </p>
                </div>
                <div className="causes-btn">
                  <a className="btn btn-custom">Learn More</a>
                  <a className="btn btn-custom">Donate Now</a>
                </div>
              </div>
              <div className="causes-item">
                <div className="causes-img">
                  <img src="img/causes-2.jpg" alt="Image" />
                </div>
                <div className="causes-progress">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={85}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span>85%</span>
                    </div>
                  </div>
                  <div className="progress-text">
                    <p>
                      <strong>Raised:</strong> $100000
                    </p>
                    <p>
                      <strong>Goal:</strong> $50000
                    </p>
                  </div>
                </div>
                <div className="causes-text">
                  <h3>Lorem ipsum dolor sit</h3>
                  <p>
                    Lorem ipsum dolor sit amet elit. Phasell nec pretium mi. Curabit
                    facilis ornare velit non vulputa
                  </p>
                </div>
                <div className="causes-btn">
                  <a className="btn btn-custom">Learn More</a>
                  <a className="btn btn-custom">Donate Now</a>
                </div>
              </div>
              <div className="causes-item">
                <div className="causes-img">
                  <img src="img/causes-3.jpg" alt="Image" />
                </div>
                <div className="causes-progress">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={85}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span>85%</span>
                    </div>
                  </div>
                  <div className="progress-text">
                    <p>
                      <strong>Raised:</strong> $100000
                    </p>
                    <p>
                      <strong>Goal:</strong> $50000
                    </p>
                  </div>
                </div>
                <div className="causes-text">
                  <h3>Lorem ipsum dolor sit</h3>
                  <p>
                    Lorem ipsum dolor sit amet elit. Phasell nec pretium mi. Curabit
                    facilis ornare velit non vulputa
                  </p>
                </div>
                <div className="causes-btn">
                  <a className="btn btn-custom">Learn More</a>
                  <a className="btn btn-custom">Donate Now</a>
                </div>
              </div>
              <div className="causes-item">
                <div className="causes-img">
                  <img src="img/causes-4.jpg" alt="Image" />
                </div>
                <div className="causes-progress">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      aria-valuenow={85}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span>85%</span>
                    </div>
                  </div>
                  <div className="progress-text">
                    <p>
                      <strong>Raised:</strong> $100000
                    </p>
                    <p>
                      <strong>Goal:</strong> $50000
                    </p>
                  </div>
                </div>
                <div className="causes-text">
                  <h3>Lorem ipsum dolor sit</h3>
                  <p>
                    Lorem ipsum dolor sit amet elit. Phasell nec pretium mi. Curabit
                    facilis ornare velit non vulputa
                  </p>
                </div>
                <div className="causes-btn">
                  <a className="btn btn-custom">Learn More</a>
                  <a className="btn btn-custom">Donate Now</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Causes End */}
        {/* Donate Start */}


        {role != 'admin' ?
          <DonateNow /> : null}




        {/* Donate End */}
        {/* Event Start */}

        {role == 'user' || role == 'orphanage' ?
          <div className="event">
            <div className="container">
              <div className="section-header text-center">
                <p>Restaurants</p>
                <h2>Giving liberates the soul of the giver</h2>
              </div>
              <div className="row">

                {restaurant.slice(0, 2).map((data) => (
                  <div className="col-lg-6">
                    <div className="event-item">
                      <img src={data.restaurant_images[0]} style={{ height: '350px', width: '100%', objectFit: 'cover' }} alt="Image" />
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
                          <p>
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
                                      <span style={{ position: "absolute", overflow: "hidden", width: "43%", color: 'gold' }}>★</span>
                                      <span style={{ color: "gray" }}>★</span>
                                    </>
                                  ) : (
                                    "★"
                                  )}
                                </span>
                              );
                            })}
                          </p>
                          <p style={{ textWrap: 'auto' }}>
                            <i className="fa fa-map-marker-alt" />
                            {data?.address}
                          </p>
                        </div>
                        <div className="event-text">
                          <h3>{data?.restaurant_name}</h3>
                          <p>
                            Lorem ipsum dolor sit amet elit. Neca pretim miura bitur
                            facili ornare velit non vulpte liqum metus tortor
                          </p>
                          <a className="btn btn-custom" href={`/single-rest/${data?._id}`}>
                            View
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                ))}



              </div>
            </div>
          </div> : ''
        }



        {/* Event End */}

        {role == 'user' || role == 'restaurant' ?

          < div className="blog">
            <div className="container">
              <div className="section-header text-center">
                <p>Orphanages</p>
                <h2>Every orphan deserves love, care, and a chance to dream</h2>
              </div>
              <div className="row">

                {orphanages.map((data) => (
                  <div className="col-lg-4">
                    <div className="blog-item">
                      <div className="blog-img">
                        <img src={data?.orphanage_images[0]} alt="Image" />
                      </div>
                      <div className="blog-text">
                        <h3>
                          <a href="#">{data.orphanage_name}</a>
                        </h3>
                        <p>
                          {data.address}
                        </p>
                      </div>
                      <div className="blog-meta">
                        <p>
                          <i className="fa fa-phone" />
                          <a href="">{data.mobile}</a><br />
                          <i className="fa fa-envelope" />
                          <a href="">{data.email}</a>
                        </p>

                      </div>
                      <div className="blog-meta">
                        <button className="btn btn-custom" onClick={() => { handleDonation(data._id), setUpi(data.upi), checkLogin() }}>Donate Money</button>
                      </div>
                    </div>
                  </div>
                ))}

                {showDonationModal && (

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
                          <h5 className="modal-title">Donate Money</h5>
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => setShowDonationModal(false)}
                            style={{ color: "red", fontSize: "18px" }}
                          >
                            <b style={{ color: 'black' }}>X</b>
                          </button>
                        </div>

                        <div className="modal-body text-center p-4">
                          <form>
                            <div className="form-group mb-3">
                              <label htmlFor="donations" className="form-label fw-bold">Enter Amount (0 - 5000)</label>
                              <input
                                type="number"
                                className="form-control"
                                id="donations"
                                name="donations"
                                onChange={(e) => {
                                  let value = Number(e.target.value);
                                  if (value >= 4999) value = 5000;
                                  if (value < 0) value = '';
                                  if (!value) value = '';
                                  setDonationAmount(value);
                                }}
                                required
                                placeholder='max amount is 5000'
                                value={DonationAmount}
                                min="1"
                                max="4999"
                                style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                              />

                            </div>
                            <button className="btn btn-success w-100" onClick={(e) => { e.preventDefault(), setShowQrModal(true), setShowDonationModal(false), saveDonation() }}>Submit</button>
                          </form>
                        </div>


                      </div>
                    </div>
                  </div>

                )}

                {showQrModal && (
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
                            onClick={() => setShowQrModal(false)}
                          ></button>
                        </div>
                        <div className="modal-body text-center">
                          {upi ? (
                            <>
                              <p>
                                Scan the QR code below or use a UPI app to make your
                                donation.
                              </p>
                              <QRCode value={upi} size={200} />
                              <p className="mt-3">
                                <strong>Amount:</strong> ₹{DonationAmount}
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
            </div>
          </div>

          : ''
        }


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

    </>
  )
}
