import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api'; // Add this import

function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetInfo, setResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // 🚀 REAL API CALL
      const result = await authAPI.forgotPassword(email);
      
      console.log('Password reset email sent:', result);
      setResetInfo(result);
      setSubmitted(true);
      
      // Show additional info in development
      if (result.reset_token) {
        console.log('DEV MODE: Reset token:', result.reset_token);
        console.log('DEV MODE: Reset link:', result.reset_link);
      }
      
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
          {/* Left side - Brand */}
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-center">
            <div className="text-6xl bg-yellow-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">🔒</div>
            <h1 className="text-4xl font-bold text-blue-800 text-center mb-4">Password Recovery</h1>
            <p className="text-lg text-gray-600 text-center">
              We'll help you regain access to your account
            </p>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-bold">Note:</span> Password reset link will expire in 24 hours. Check your spam folder if you don't see the email.
              </p>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Your Password</h2>
              <p className="text-gray-500">Enter your email to receive a reset link</p>
            </div>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="text-center py-8">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to:<br/>
                  <span className="font-medium">{email}</span>
                </p>
                
                {/* Development info - show token in console only */}
                {resetInfo?.note && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <p className="text-yellow-700 text-sm">{resetInfo.note}</p>
                    <p className="text-yellow-700 text-xs mt-1">
                      Check browser console for reset token (development only)
                    </p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <Link 
                    to="/login" 
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    Return to Login
                  </Link>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setError('');
                    }}
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
      
      <footer className="bg-blue-900 text-white py-4">
        <p className="text-center text-sm">
          Secure recovery process • Encrypted communication
        </p>
      </footer>
    </div>
  );
}

export default PasswordRecoveryPage;