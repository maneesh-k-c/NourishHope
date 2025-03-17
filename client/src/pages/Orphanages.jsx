import React, { useEffect, useState } from 'react'
import NavBar from '../components/navbar/NavBar'
import Footer from '../components/navbar/Footer'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
export default function Orphanages() {
    const [orphanages, setOrphanages] = useState([])
    console.log(orphanages);
    const[role,setRole]=useState(localStorage.getItem('role'))
    useEffect(() => {
       axios.get('http://localhost:5000/api/auth/getorphanage').then((res) => {
            setOrphanages(res.data.data)
       })
    },[])

    const handleDelete = (id) => {
        axios.get(`http://localhost:5000/api/auth/orphanage_delete/${id}`).then((res) => {
            toast.success(res.data.Message)
            const filterData = orphanages.filter((item) => item._id !== id)
            setOrphanages(filterData)
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
                        <h2>Orphanages</h2>
                    </div>
                    <div className="col-12">
                        <a href="/">Home</a>
                        <a>Orphanages</a>
                    </div>
                </div>
            </div>
        </div>
        {/* Page Header End */}
        {/* Event Start */}
        <div className="event">
            <div className="container">

                <div className="row">
                    {orphanages.map((orphanage) => (
                        <div className="col-lg-5">
                        <div className="event-item">
                            <img src={orphanage?.orphanage_images[0]} alt="Image" />
                            <div className="event-content">
                                <div className="event-meta">
                                    <p style={{ textWrap: 'auto' }}>
                                        <i className="fa fa-mobile-alt" />
                                        {orphanage?.mobile}
                                    </p>
                                    <p style={{ textWrap: 'auto' }}>
                                        <i className="far fa-envelope" />
                                        {orphanage?.email}
                                    </p>
                                    <p style={{ textWrap: 'auto' }}>
                                        <i className="fa fa-map-marker-alt" />
                                        {orphanage.address}
                                    </p>
                                </div>
                                <div className="event-text"> 
                                    <h3>{orphanage?.orphanage_name}</h3>
                                    <p>
                                        {/* Lorem ipsum dolor sit amet elit. Neca pretim miura bitur */}
                                    </p>
                                    <a className="btn btn-custom btn-danger text-white" onClick={()=>{handleDelete(orphanage._id)}}>
                                        Delete
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
