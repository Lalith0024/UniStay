import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import { API_ENDPOINTS } from '../config';



function Login() {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const email = (loginInfo.email || '').trim();
    const password = loginInfo.password || '';
    if (!email || !password) {
      return handleError('Email and password are required');
    }

    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });


      let result = {};
      try {
        result = await response.json();
      } catch {

      }

      console.log('Login response:', result);

      if (response.ok) {
        // accept either `token` or `jwtToken`
        const authToken = result.token || result.jwtToken;
        if (!authToken) {
          return handleError('Authentication token not received');
        }
        handleSuccess(result.message || 'Login successful');
        localStorage.setItem('token', authToken);
        localStorage.setItem('loggedInUser', result.name || email);
        navigate('/');
        return;
      }

      // Non-2xx: construct a helpful message
      let errorMessage = result?.message || 'Login failed';
      const error = result?.error;

      if (error) {
        if (typeof error === 'string') errorMessage = error;
        else if (Array.isArray(error)) errorMessage = error[0]?.message || errorMessage;
        else if (error.details && Array.isArray(error.details)) errorMessage = error.details[0]?.message || errorMessage;
      }

      if (response.status === 403) {
        errorMessage = 'Invalid email or password';
      } else if (response.status === 500) {
        errorMessage = result?.message || 'Server error. Please try again later.';
      } else if (response.status === 503) {
        if (result?.details) {
          errorMessage = (result?.message ? result.message + '. ' : '') + result.details;
        } else {
          errorMessage = result?.message || 'Database is not available. Please check if MongoDB is running.';
        }
      }

      handleError(errorMessage);
    } catch (err) {
      console.error('Login error:', err);
      if (err.name === 'TypeError' && /fetch/i.test(err.message || '')) {
        handleError('Cannot connect to server. Please check if the backend is running.');
      } else {
        handleError(err.message || 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-container'>
      <div className='container'>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              onChange={handleChange}
              type='email'
              name='email'
              placeholder='Enter your email...'
              value={loginInfo.email}
              required
              autoComplete='email'
              disabled={loading}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              onChange={handleChange}
              type='password'
              name='password'
              placeholder='Enter your password...'
              value={loginInfo.password}
              required
              autoComplete='current-password'
              disabled={loading}
            />
          </div>
          <button
            type='submit'
            className='btn-primary'
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className='auth-link'>
            <span>Don&apos;t have an account? </span>
            <Link to='/register'>Sign Up</Link>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}
export default Login;