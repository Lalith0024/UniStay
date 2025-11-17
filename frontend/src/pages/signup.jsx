import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { API_ENDPOINTS } from '../config';

function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('Name, email and password are required')
        }
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupInfo)
            });
            const result = await response.json();
            const { success, message, error } = result;
            
            if (response.ok && success) {
                handleSuccess(message || 'Registration successful');
                setTimeout(() => {
                    navigate('/login')
                }, 1000)
            } else {
                let errorMessage = message || 'Registration failed';
                if (error) {
                    if (typeof error === 'string') {
                        errorMessage = error;
                    } else if (Array.isArray(error)) {
                        errorMessage = error[0]?.message || errorMessage;
                    } else if (error.details && Array.isArray(error.details)) {
                        errorMessage = error.details[0]?.message || errorMessage;
                    }
                }
                if (response.status === 400) {
                    errorMessage = message || 'Invalid input. Please check your information.';
                } else if (response.status === 500) {
                    errorMessage = message || 'Server error. Please try again later.';
                } else if (response.status === 503) {
                    if (result.details) {
                        errorMessage = result.message + '. ' + result.details;
                    } else {
                        errorMessage = result.message || 'Database is not available. Please check if MongoDB is running.';
                    }
                }
                handleError(errorMessage);
            }
        } catch (err) {
            handleError(err.message || 'Network error. Please try again.');
        }
    }
    return (
        <div className='auth-container'>
            <div className='container'>
                <h1>Sign Up</h1>
                <form onSubmit={handleSignup}>
                    <div className='form-group'>
                        <label htmlFor='name'>Name</label>
                        <input
                            onChange={handleChange}
                            type='text'
                            name='name'
                            autoFocus
                            placeholder='Enter your name...'
                            value={signupInfo.name}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handleChange}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={signupInfo.email}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={handleChange}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={signupInfo.password}
                            required
                        />
                    </div>
                    <button type='submit' className='btn-primary'>Sign Up</button>
                    <div className='auth-link'>
                        <span>Already have an account? </span>
                        <Link to="/login">Login</Link>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>
    )
}

export default Signup