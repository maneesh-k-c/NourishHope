import React,{useEffect, useState} from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function UpdateRest() {
    
    const [formRestData, setFormRestData] = useState({
            restaurant_name: '',
            mobile: '',
            email: '',
            description:'',
            upi:'',
            address:'',
            // image: '',
            username: '',
            password: '',
        });
        
         const [resterrors, setrestErrors] = useState({});
console.log(formRestData);

         const [role, setRole] = useState(localStorage.getItem('role'))
         useEffect(() => {
             axios.get(`http://localhost:5000/api/auth/getProfile/${localStorage.getItem('loginId')}/${role}`).then((res) => {
                setFormRestData({
                     loginId: res.data?.data?.login_id?._id,
                     restaurant_name: res.data.data.restaurant_name,
                     mobile: res.data.data.mobile,
                     email: res.data.data.email,
                     description: res.data.data.description,
                     upi: res.data.data.upi,
                     address: res.data.data.address,
                     username: res.data.data?.login_id?.username,
                     password: res.data.data?.login_id?.password,
                 })
             })
         },[role])
         const handlerestInputChange = (e) => {
            const { name, value } = e.target;
            setFormRestData({ ...formRestData, [name]: value });
            setrestErrors({ ...resterrors, [name]: '' });
        };
        const validateRestForm = () => {
            const newErrors = {};
            let isValid = true;
    
            if (!formRestData.restaurant_name.trim()) {
                newErrors.restaurant_name = 'This field is required';
                isValid = false;
            }
            if (!formRestData.address.trim()) {
                newErrors.address = 'This field is required';
                isValid = false;
            }
            if (!formRestData.description){
                newErrors.description = 'This field is required';
                isValid = false;
            }
            if (!formRestData.upi.trim()) {
                newErrors.upi = 'This field is required';
                isValid = false;
            }
            if (!formRestData.email){
                newErrors.email = 'This field is required';
                isValid = false;
            } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formRestData.email)) {
                newErrors.email = 'Invalid email format';
                isValid = false;
            }
            if (!formRestData.mobile.trim()) {
                console.log('hi');
    
                newErrors.mobile = 'This field is required';
                isValid = false;
            } else if (!/^\d+$/.test(formRestData.mobile)) {
                console.log('hello');
    
                newErrors.mobile = 'Invalid mobile format';
                isValid = false;
            } else if (formRestData.mobile.length !== 10) {
                newErrors.mobile = 'Invalid mobile format';
                isValid = false;
            }
    
            if (!formRestData.username.trim()) {
                newErrors.username = 'This field is required';
                isValid = false;
            }
            if (!formRestData.password.trim()) {
                newErrors.password = 'This field is required';
                isValid = false;
            }
    
           
    
    
            setrestErrors(newErrors);
            return isValid;
        };
        const handleSubmitrest = (e) => {
            e.preventDefault();
            console.log('Form Submitted', validateRestForm());
            if (validateRestForm()) {
    
                // const formDataToSend = new FormData();
                
    
                // formDataToSend.append('restaurant_name', formRestData.restaurant_name);
                // formDataToSend.append('mobile', formRestData.mobile);
                // formDataToSend.append('email', formRestData.email);
                // formDataToSend.append('upi', formRestData.upi);
                // formDataToSend.append('address', formRestData.address);
                // formDataToSend.append('image', formRestData.image);
                // formDataToSend.append('username', formRestData.username);
                // formDataToSend.append('password', formRestData.password);
               
                axios.post('http://localhost:5000/api/auth/update-rest', formRestData).then((res) => {
                    toast.success(res.data.Message)
                    setTimeout(() => {
                        navigate("/profile")
                    }, 2000);
                    console.log(res);
                }).catch((err) => {
                    console.log(err);
                    toast.success(err.response.data.Message)
                });
    
            }
    
        };
    
  return (
    <>
                <div className="container">
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                    />
                    <div
                        className="volunteer"
                        data-parallax="scroll"
                        data-image-src="img/volunteer.jpg"
                    >
                        <div className="row align-items-center">
                            <div className="col-lg-5">
                                <div className="volunteer-content">
                                    <div className="section-header">
                                        <p>Update Profile</p>
                                        <h2>Let’s make a difference in the lives of others</h2>
                                    </div>
                                    <div className="volunteer-text">
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="volunteer-form">
                                    <div className="form-switch-buttons" style={{ display: 'flex', marginTop: '-50px', marginBottom: '50px' }}>
                                      
                                    </div>
    
                                  
    
    
    
    
    
                                        <form onSubmit={handleSubmitrest}>
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    name="restaurant_name"
                                                    style={{ borderColor: resterrors.restaurant_name ? '#dc3545' : '' }}
                                                    className={`form-control ${resterrors.restaurant_name ? 'is-invalid' : ''}`}
                                                    placeholder="Restaurant Name"
                                                    value={formRestData.restaurant_name}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.restaurant_name && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.restaurant_name}</div>}
                                            </div>
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    style={{ borderColor: resterrors.mobile ? '#dc3545' : '' }}
                                                    className={`form-control ${resterrors.mobile ? 'is-invalid' : ''}`}
                                                    placeholder="Mobile"
                                                    value={formRestData.mobile}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.mobile && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.mobile}</div>}
                                            </div>
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    style={{ borderColor: resterrors.email ? '#dc3545' : '' }}
                                                    className={`form-control ${resterrors.email ? 'is-invalid' : ''}`}
                                                    placeholder="Restaurant Email"
                                                    value={formRestData.email}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.email && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.email}</div>}
                                            </div>
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    name="upi"
                                                    style={{ borderColor: resterrors.upi ? '#dc3545' : '' }}
                                                    className={`form-control ${resterrors.upi ? 'is-invalid' : ''}`}
                                                    placeholder="upi id"
                                                    value={formRestData.upi}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.upi && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.upi}</div>}
                                            </div>
                                            {/* <div className="control-group" style={{ position: 'relative' }}>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    className={`form-control ${resterrors.image ? 'is-invalid' : ''}`}
                                                    placeholder="Image"
                                                    style={{ borderColor: resterrors.image ? '#dc3545' : '' }}
                                                    onChange={handlerestFileChange}
                                                />
                                                {resterrors.image && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.image}</div>}
                                            </div> */}
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <textarea
                                                    name="address"
                                                    className={`form-control ${resterrors.address ? 'is-invalid' : ''}`}
                                                    placeholder="Address"
                                                    value={formRestData.address}
                                                    style={{ borderColor: resterrors.address ? '#dc3545' : '' }}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.address && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.address}</div>}
                                            </div>
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <textarea
                                                    name="description"
                                                    className={`form-control ${resterrors.description ? 'is-invalid' : ''}`}
                                                    placeholder="Description"
                                                    
                                                    style={{ borderColor: resterrors.description ? '#dc3545' : '' }}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.address && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.description}</div>}
                                            </div>
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className={`form-control ${resterrors.username ? 'is-invalid' : ''}`}
                                                    placeholder="Username"
                                                    style={{ borderColor: resterrors.username ? '#dc3545' : '' }}
                                                    value={formRestData.username}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.username && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.username}</div>}
                                            </div>
                                            <div className="control-group" style={{ position: 'relative' }}>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className={`form-control ${resterrors.password ? 'is-invalid' : ''}`}
                                                    placeholder="Password"
                                                    style={{ borderColor: resterrors.password ? '#dc3545' : '' }}
                                                    value={formRestData.password}
                                                    onChange={handlerestInputChange}
                                                />
                                                {resterrors.password && <div className="invalid-feedback" style={{
                                                    position: 'absolute',
                                                    width: '130px',
                                                    top: '-15px',
                                                    left: '3px',
                                                    backgroundColor: '#fdbe33'
                                                }}>{resterrors.password}</div>}
                                            </div>
                                            <div>
                                                <button className="btn btn-custom" type="submit">
                                                    Update
                                                </button>
                                            </div>
                                            
                                        </form>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
  )
}
