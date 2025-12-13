import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await authAPI.forgotPassword(email);
      console.log('Reset email sent:', result);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h1 className="text-2xl font-bold text-gray-800">Reset Password</h1>
              <p className="text-gray-600 mt-2">Enter your email to receive a reset link</p>
            </div>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm p-3 bg-red-50 rounded">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                
                <div className="text-center pt-4">
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    ← Back to Login
                  </Link>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to:<br/>
                  <span className="font-medium">{email}</span>
                </p>
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Return to Login
                  </Link>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Try another email
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResetPasswordRequest;