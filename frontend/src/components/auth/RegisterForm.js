import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { authAPI } from '../../services/api';

function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false 
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Add navigation hook

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    
    if (formData.phone && !/^[\d\s\-+()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Non-blocking toast notification
  const showToast = (message, type = 'success') => {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500'
    };
    
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-2 rounded shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('translate-x-full');
    }, 10);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      // 🚀 REAL API CALL
      const registrationData = {
        email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone_number: formData.phone || null, // Send phone number to backend
        role: 'user',
      };
      
      console.log('🔄 Registering user:', registrationData.email);
      
      // 1. Register the user
      const result = await authAPI.register(registrationData);
      
      console.log('✅ Registration successful:', result);
      
      // Show success toast (non-blocking)
      showToast(`Account created successfully! Welcome ${result.full_name}`);
      
      // 2. Auto-login after successful registration
      console.log('🔄 Auto-login after registration...');
      const loginResult = await authAPI.login(formData.email, formData.password);
      
      // Store the token
      localStorage.setItem('authToken', loginResult.access_token || loginResult.token);
      
      // 3. Get user info
      const userData = await authAPI.getCurrentUser();
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      // 4. Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      
      // 5. ✅ AUTO-REDIRECT to dashboard WITHOUT clicking OK
      console.log('🚀 Redirecting to dashboard...');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      // Show specific error messages
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for email already exists
      if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
        errorMessage = 'Email already registered. Please use a different email.';
      }
      
      showToast(errorMessage, 'error');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Create Account</h2>
          <p className="text-gray-500 text-center">Join our water quality monitoring platform</p>
        </div>
        
        {/* Name Fields - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">First Name *</label>
            <input
              type="text"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="First name"
              disabled={loading}
            />
            {errors.firstName && (
              <div className="text-red-600 text-sm mt-1">{errors.firstName}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Last Name *</label>
            <input
              type="text"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Last name"
              disabled={loading}
            />
            {errors.lastName && (
              <div className="text-red-600 text-sm mt-1">{errors.lastName}</div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email Address *</label>
          <input
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
            disabled={loading}
          />
          {errors.email && (
            <div className="text-red-600 text-sm mt-1">{errors.email}</div>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="(123) 456-7890"
            disabled={loading}
          />
          {errors.phone && (
            <div className="text-red-600 text-sm mt-1">{errors.phone}</div>
          )}
          <small className="text-gray-500 text-xs block mt-1">
            Optional - for account recovery
          </small>
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password *</label>
            <input
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Create a password"
              disabled={loading}
            />
            {errors.password && (
              <div className="text-red-600 text-sm mt-1">{errors.password}</div>
            )}
            <small className="text-gray-500 text-xs block mt-1">
              Use letters, numbers, and symbols
            </small>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
            <input
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              disabled={loading}
            />
            {errors.confirmPassword && (
              <div className="text-red-600 text-sm mt-1">{errors.confirmPassword}</div>
            )}
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="space-y-2">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
              className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-blue-500"
              disabled={loading}
            />
            <span className="text-gray-600 text-sm">
              I agree to the{' '}
              <a href="/terms" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeTerms && (
            <div className="text-red-600 text-sm ml-7">{errors.agreeTerms}</div>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        {/* Navigation Link */}
        <div className="text-center pt-4 border-t border-gray-200">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;