import React, { useState } from 'react';
import "../../Styles/auth/SignupPage.css";
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://localhost:4000/api/signin";
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                setData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                });
                navigate('/');
            } else {
                setError(result.error || 'Something went wrong!');
            }
        } catch (error) {
            setError('Network error');
        }
    }

    return (
        <div className='signup_container'>
            <div className='signup_form_container'>
                <div className='left'>
                    <h1>Welcome Back</h1>
                    <Link to="/">
                        <button type='button' className='white_btn'>
                            Sign in
                        </button>
                    </Link>
                </div>
                <div className='right'>
                    <form className='form_container' onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <input
                            type='text'
                            placeholder='First Name'
                            name='firstName'
                            onChange={handleChange}
                            value={data.firstName}
                            
                            className='input'
                        />
                        <input
                            type='text'
                            placeholder='Last Name'
                            name='lastName'
                            onChange={handleChange}
                            value={data.lastName}
                            
                            className='input'
                        />
                        <input
                            type='email'
                            placeholder='Email'
                            name='email'
                            onChange={handleChange}
                            value={data.email}
                            
                            className='input'
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            name='password'
                            onChange={handleChange}
                            value={data.password}
                            
                            className='input'
                        />
                        {error && <div className='error_msg'>{error}</div>}
                        <button type='submit' className='green_btn'>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;
