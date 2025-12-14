// src/pages/Register.js

import React, { useState } from 'react';
import { FiUserPlus, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi'; // <-- ADD FiArrowLeft
import api from "../utils/api"; 
import { 
  MIN_PASSWORD_LENGTH, 
  ROLE_OPTIONS, 
  EXACT_PHONE_LENGTH,
  isRequired, 
  isValidEmail, 
  isValidPhone, 
  isValidPassword, 
  isValidRole 
} from '../utils/validation';

// Accept the new onGoBack prop
const Register = ({ onRegisterSuccess, onSwitchToLogin, onGoBack }) => {
  // ... (Existing state hooks remain unchanged) ...
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('citizen'); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Validation Logic (using utilities) ---
    if (!isRequired(name)) { setError('Name is required.'); return; }
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!isValidPhone(phone)) { setError('Invalid phone no. Please enter a valid 10-digit phone number.'); return; }
    if (!isRequired(location)) { setError('Location is required.'); return; }
    if (!isValidRole(role)) { setError('Please select a valid user role.'); return; }
    if (!isValidPassword(password)) { setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    // --- End Validation Logic ---

    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', { 
        name, email, phone, location, role, password,
      });

      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      onRegisterSuccess();

    } catch (err) {
      console.error("Registration Error:", err.response ? err.response.data : err.message);
      const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : 'Registration failed. Please check the provided information.';
        
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
          <FiUserPlus className="text-cyan-400" /> Create Account
        </h2>
        
        {/* ... (rest of the form content remains the same) ... */}
        {error && (
          <div className="mb-4 p-3 text-sm font-medium bg-red-900/50 border border-red-700 text-red-200 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Name field */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="name">Name</label>
            <input 
              id="name" 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
            />
          </div>
          
          {/* ... (rest of the form inputs) ... */}
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="reg-email">Email</label>
            <input 
              id="reg-email" 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
            />
          </div>
          
          {/* Phone Number field */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="phone">Phone Number ({EXACT_PHONE_LENGTH} digits)</label>
            <input 
              id="phone" 
              type="tel" 
              required
              maxLength={EXACT_PHONE_LENGTH} 
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
            />
          </div>
          
          {/* Location field */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="location">Location (City/Region)</label>
            <input 
              id="location" 
              type="text" 
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="role">User Role</label>
            <select
              id="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600 appearance-none pr-10"
              style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%2364748b' d='M9.293 12.95l1.414 1.414 4.586-4.586L10.707 5.793 9.293 7.207l3.586 3.586-3.586 3.586z'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em',
              }}
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Password field with Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="reg-password">
              Password (min {MIN_PASSWORD_LENGTH} chars)
            </label>
            <input 
              id="reg-password" 
              type={showPassword ? "text" : "password"} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              minLength={MIN_PASSWORD_LENGTH}
              className="w-full pr-10 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-slate-400 hover:text-cyan-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
          
          {/* Confirm Password field with Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-400 mb-1" htmlFor="confirm-password">Confirm Password</label>
            <input 
              id="confirm-password" 
              type={showPassword ? "text" : "password"} 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full pr-10 px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-50 focus:ring-cyan-600 focus:border-cyan-600" 
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 text-slate-400 hover:text-cyan-400"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-slate-900 font-bold rounded-md transition duration-150 disabled:opacity-50"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <button 
            onClick={onSwitchToLogin} 
            className="text-sm text-slate-400 hover:text-cyan-400 flex items-center justify-center mx-auto gap-1"
          >
            Already have an account? Log In.
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;