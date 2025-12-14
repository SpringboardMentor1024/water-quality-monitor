// src/pages/Login.js

import React, { useState } from 'react';
import { FiLogIn, FiUserPlus, FiArrowLeft } from 'react-icons/fi'; // <-- ADD FiArrowLeft
import { FaGoogle, FaFacebookF, FaLinkedinIn } from 'react-icons/fa'; 
import api from "../utils/api"; 
import { MIN_PASSWORD_LENGTH, isValidEmail, isValidPassword } from '../utils/validation';

// Accept the new onGoBack prop
const Login = ({ onLoginSuccess, onSwitchToRegister, onGoBack }) => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  
  // ... (handleSocialLogin, handleForgotPassword, handleLogin functions remain unchanged) ...
  const handleSocialLogin = (provider) => {
    alert(`Redirecting to ${provider} for sign-in. This feature requires a backend OAuth setup.`);
    console.log(`Attempting social login via ${provider}`);
  };

  const handleForgotPassword = () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address above to initiate password reset.");
      return;
    }
    alert(`Password reset initiated for ${email}. Check your inbox for instructions!`);
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!isValidPassword(password)) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onLoginSuccess(); 

    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 w-full max-w-sm shadow-2xl relative"> 
        {/* --- NEW GO BACK BUTTON --- */}
        <button 
          onClick={onGoBack} 
          className="absolute top-4 left-4 text-slate-400 hover:text-cyan-400 transition duration-150"
          aria-label="Go back to main page"
        >
          <FiArrowLeft className="w-6 h-6" />
        </button>
        {/* --------------------------- */}
        
        <h2 className="text-3xl font-bold text-slate-50 mb-6 text-center flex items-center justify-center gap-2">
          <FiLogIn className="text-cyan-400" /> Sign In
        </h2>
        
        {/* ... (rest of the form content remains the same) ... */}
        {error && (
          <div className="mb-4 p-3 text-sm font-medium bg-red-900/50 border border-red-700 text-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
            {/* Email and Password Inputs */}
            {/* ... (Code for inputs) ... */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="email">Email</label>
              <input 
                id="email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-slate-400 hover:text-cyan-400"
              >
                Forgot Password?
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold rounded-md transition duration-150 disabled:opacity-50"
            >
              {isLoading ? 'Log In...' : 'Log In'}
            </button>
        </form>

        {/* Social Login Section */}
        <div className="mt-6">
            <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-700"></div>
                <div className="absolute px-4 text-sm text-slate-400 bg-slate-900/90">
                    Or sign in with
                </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
                <button onClick={() => handleSocialLogin('google')} className="p-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition duration-150 text-slate-50 hover:text-red-500" aria-label="Sign in with Google"><FaGoogle className="w-5 h-5" /></button>
                <button onClick={() => handleSocialLogin('facebook')} className="p-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition duration-150 text-slate-50 hover:text-blue-600" aria-label="Sign in with Facebook"><FaFacebookF className="w-5 h-5" /></button>
                <button onClick={() => handleSocialLogin('linkedin')} className="p-3 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 transition duration-150 text-slate-50 hover:text-cyan-600" aria-label="Sign in with LinkedIn"><FaLinkedinIn className="w-5 h-5" /></button>
            </div>
        </div>
        
        <div className="mt-6 text-center">
          <button 
            onClick={onSwitchToRegister} 
            className="text-sm text-slate-400 hover:text-cyan-400 flex items-center justify-center mx-auto gap-1"
          >
            <FiUserPlus className="w-4 h-4" /> Need an account? Register here.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;