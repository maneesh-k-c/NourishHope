import React, { useEffect, useState } from 'react'
import NavBar from '../../components/navbar/NavBar'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import QRCode from 'react-qr-code';
export default function Notification() {
            const [listDonations, setListDonations] = useState([])
            console.log(listDonations);
        
        
            useEffect(() => {
            const login_id = localStorage.getItem('loginId')
            axios.get(`http://localhost:5000/api/rest/list_donations_user/${login_id}`).then((res) => {
                setListDonations(res.data.data)
            })
            }, [])
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
                 <h2 style={{ textTransform: 'uppercase' }}>Notification</h2>
               </div>
               <div className="col-12">
                 <a href="">Home</a>
                 <a href="">Notification</a>
               </div>
             </div>
           </div>
         </div>
         {/* Page Header End */}
         {/* Single Post Start*/}
         <div className="single">
           <div className="container">
             <div className="row">
               {listDonations.map((item, index) => (
                 <div className="col-lg-5">
   
                   <div className="single-bio">
                     <div className="single-bio-img">
                       {/* <i className='fa fa-user-circle fa-2x' style={{ fontSize: '50px' }} /> */}
                       <h6>Date</h6>
                       <p>{new Date(item.submittedAt).toLocaleDateString("en-GB")}</p>
                       <p>
                         <b>Donation</b>  {item.quantity}
                       </p>
                     </div>
                     <div className="single-bio-text"
                     // style={{ position: 'relative' }}
                     >
                       <p><b>Restaurant</b> : <b>{item.restaurant_id?.restaurant_name}</b>,{item.restaurant_id?.address}</p>
                       
                       <p>
                         <b>No of quantity donated</b> : {item.quantity_donated?item.quantity_donated:0}
                       </p>
                       <p>
                         <b>Donation status</b> : {item.status}
                       </p>
                       <hr />
                       {item?.orphanage_id.map((data) =>(
                        <>
                         <p>
                         <b>Orphanage</b> : {data.orphanage.orphanage_name} <br />
                         <b>quantity received</b> : {data.donated} <br />
                         <b>received date</b> : {new Date(data.date).toLocaleDateString("en-GB")} <br />
   
                         
                       </p><hr />
                       </>
                       ))}
   
                     </div>
                   </div>
   
                 </div>
               ))}
   
   
             </div>
           </div>
         </div>
   
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
  )
}
