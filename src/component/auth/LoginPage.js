import React, { useState } from 'react';
import "../../Styles/auth/SignupPage.css"
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState("")
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //  Login Request
            const url = "http://localhost:4000/api/login";
            const { data: res } = await axios.post(url, data);
            
            // Store token in localStorage
            localStorage.setItem("token", res.token);
            console.log("Login successful");
    
            //  Retrieve Token from localStorage
            const token = localStorage.getItem("token");
            console.log("Token retrieved:", token); // Ensure the token is correctly retrieved
    
            //Fetch User Data
            const userDataUrl = "http://localhost:4000/api/profile";
            const { data: user } = await axios.get(userDataUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            console.log("User data:", user.user); 
            navigate('/money', { state: { userData: user } });
    
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                const { status, data } = error.response;
                if (status >= 400 && status < 500) {
                    setError(data.error); // Set error message from backend response
                } else {
                    console.error('Server Error:', data); // Log unexpected server errors
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Request setup error:', error.message);
            }
        }
    };
    
    


console.log("Working Login Page")

    return (
        <div className='login_container'>
            <div className='login_form_container'>
                <div className='left'>
                <form className='form_container' onSubmit={handleSubmit}>
                        <h1>Login to Your Account</h1>
                        <input
                            type='text'
                            placeholder='Email'
                            name='email'
                            onChange={handleChange}
                            value={data.email}
                            required
                            className='input'
                        />

                        <input
                            type='text'
                            placeholder='Password'
                            name='password'
                            onChange={handleChange}
                            value={data.password}
                            required
                            className='input'
                        />
                        {error && <div className='error_msg'>{error}</div>}
                        <button type='submit' className='green_btn'>
                            Sign In
                        </button>
                    </form>

                </div>
                <div className='right'>
                <h1>New Here</h1>
                    <Link to="/signup">
                        <button type='button' className='white_btn'>
                            Sign up
                        </button>
                    </Link>
                
                </div>
            </div>
        </div>
    )
}

export default LoginPage