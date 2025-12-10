import React from 'react';
import CreateAccountForm from '../../components/auth/RegisterForm';

function RegisterPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <section className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8">
          {/* Left side - Brand */}
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col justify-center">
            <div className="text-6xl bg-green-100 p-4 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">💧</div>
            <h1 className="text-4xl font-bold text-blue-800 text-center mb-4">Join AquaTrack Pro</h1>
            <p className="text-lg text-gray-600 text-center">
              Create your account for water quality monitoring
            </p>
            <ul className="mt-6 space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Real-time monitoring
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Historical data analysis
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span> Alert notifications
              </li>
            </ul>
          </div>
          
          {/* Right side - Form */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-500">Fill in your details to get started</p>
            </div>
            <CreateAccountForm />
          </div>
        </div>
      </section>
      
      <footer className="bg-blue-900 text-white py-4">
        <p className="text-center text-sm">
          Secure registration • Data encryption • GDPR compliant
        </p>
      </footer>
    </main>
  );
}

export default RegisterPage;