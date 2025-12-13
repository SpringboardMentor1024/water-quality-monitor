import React from 'react';
import SignInForm from '../../components/auth/LoginForm';

function LoginPage() {
  return (
    <main className="signin-page min-h-screen flex flex-col">
      <section className="signin-section flex-grow flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
          {/* Left side - Brand */}
          <div className="brand-section bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-center">
            <div className="brand-logo text-6xl bg-blue-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">💧</div>
            <h1 className="brand-title text-4xl font-bold text-blue-800 text-center mb-4">AquaTrack Pro</h1>
            <p className="brand-tagline text-lg text-gray-600 text-center">
              Real-time water quality monitoring platform
            </p>
          </div>
          
          {/* Right side - Form */}
          <div className="form-section bg-white rounded-2xl p-8 shadow-xl">
            <div className="form-header mb-8">
              <h2 className="welcome-text text-3xl font-bold text-gray-800 mb-2">Account Access</h2>
              <p className="instruction-text text-gray-500">Enter your email and password</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </section>
      
      <footer className="page-footer bg-blue-900 text-white py-4">
        <p className="footer-note text-center text-sm">
          Secure access • Encrypted connection • 24/7 monitoring
        </p>
      </footer>
    </main>
  );
}

export default LoginPage;