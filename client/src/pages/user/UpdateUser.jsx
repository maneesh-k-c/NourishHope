import React,{useState,useEffect} from 'react'
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
export default function UpdateUser() {
    const navigate = useNavigate()
       const [formData, setFormData] = useState({
            loginId:localStorage.getItem('loginId'),
            name: '',
            mobile: '',
            email: '',
            image: '',
            username: '',
            password: '',
        });
        // console.log(formData);
        
        const [errors, setErrors] = useState({});
        const [role, setRole] = useState(localStorage.getItem('role'))
        useEffect(() => {
            axios.get(`http://localhost:5000/api/auth/getProfile/${localStorage.getItem('loginId')}/${role}`).then((res) => {
                setFormData({
                    loginId: res.data?.data?.login_id?._id,
                    name: res.data.data.name,
                    mobile: res.data.data.mobile,
                    email: res.data.data.email,
                    image: res.data.data.image,
                    username: res.data.data?.login_id?.username,
                    password: res.data.data?.login_id?.password,
                })
            })
        },[role])
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData({ ...formData, [name]: value });
            setErrors({ ...errors, [name]: '' });
        };
        const validateForm = () => {
            const newErrors = {};
            let isValid = true;
    
            if (!formData.name.trim()) {
                newErrors.name = 'This field is required';
                isValid = false;
            }
            if (!formData.email.trim()) {
                newErrors.email = 'This field is required';
                isValid = false;
            } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
                newErrors.email = 'Invalid email format';
                isValid = false;
            }
            if (!formData.mobile.trim()) {
                console.log('hi');
    
                newErrors.mobile = 'This field is required';
                isValid = false;
            } else if (!/^\d+$/.test(formData.mobile)) {
                console.log('hello');
    
                newErrors.mobile = 'Invalid mobile format';
                isValid = false;
            } else if (formData.mobile.length !== 10) {
                newErrors.mobile = 'Invalid mobile format';
                isValid = false;
            }
    
            if (!formData.username.trim()) {
                newErrors.username = 'This field is required';
                isValid = false;
            }
            if (!formData.password.trim()) {
                newErrors.password = 'This field is required';
                isValid = false;
            }
    
            // if (!formData.image) {
            //     newErrors.image = 'File is required';
            //     isValid = false;
            // }
    
    
            setErrors(newErrors);
            return isValid;
        };
        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Form Submitted', validateForm());
            if (validateForm()) {
                console.log('Form Submitted');
                
                    // const formDataToSend = new FormData();
    
                    // formDataToSend.append('name', formData.name);
                    // formDataToSend.append('mobile', formData.mobile);
                    // formDataToSend.append('email', formData.email);
                    // // formDataToSend.append('image', formData.image);
                    // formDataToSend.append('username', formData.username);
                    // formDataToSend.append('password', formData.password);
                    // formDataToSend.append('loginId', formData.loginId);
                    console.log(formData);
                    
                    axios.post('http://localhost:5000/api/auth/update-user',formData).then((res) => {
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

                              
                                    <form onSubmit={handleSubmit}>

                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="name"
                                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                placeholder="Name"
                                                style={{ borderColor: errors.name ? '#dc3545' : '' }}
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                            {errors.name && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.name}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="mobile"
                                                className={`form-control ${errors.mobile ? 'is-invalid' : ''}`}
                                                placeholder="Mobile"
                                                style={{ borderColor: errors.mobile ? '#dc3545' : '' }}
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.email}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                name="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                placeholder="Email"
                                                style={{ borderColor: errors.email ? '#dc3545' : '' }}
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                            {errors.email && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.email}</div>}
                                        </div>
                                        {/* <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="file"
                                                name="image"
                                                className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                                                placeholder="Image"
                                                style={{ borderColor: errors.image ? '#dc3545' : '' }}
                                                onChange={handleFileChange}
                                            />
                                            {errors.image && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.image}</div>}
                                        </div> */}

                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="username"
                                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                                placeholder="Username"
                                                style={{ borderColor: errors.username ? '#dc3545' : '' }}
                                                value={formData.username}
                                                onChange={handleInputChange}
                                            />
                                            {errors.username && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.username}</div>}
                                        </div>
                                        <div className="control-group" style={{ position: 'relative' }}>
                                            <input
                                                type="password"
                                                name="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                placeholder="Password"
                                                style={{ borderColor: errors.password ? '#dc3545' : '' }}
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            {errors.password && <div className="invalid-feedback" style={{
                                                position: 'absolute',
                                                width: '130px',
                                                top: '-15px',
                                                left: '3px',
                                                backgroundColor: '#fdbe33'
                                            }}>{errors.password}</div>}
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
