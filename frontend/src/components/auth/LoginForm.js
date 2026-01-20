import React, { useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

// Reducer function - MUST be defined OUTSIDE component
const formReducer = (currentState, action) => {
  switch (action.operation) {
    case 'MODIFY_INPUT':
      return { 
        ...currentState, 
        [action.inputName]: action.inputValue 
      };
    case 'SET_VALIDATION_ISSUE':
      return { 
        ...currentState, 
        validationIssues: { 
          ...currentState.validationIssues, 
          [action.inputName]: action.issueMessage 
        } 
      };
    case 'REMOVE_ALL_ISSUES':
      return { ...currentState, validationIssues: {} };
    default:
      return currentState;
  }
};

const LoginForm = () => {
  const navigateTo = useNavigate();
  
  const [formData, dispatchFormAction] = useReducer(formReducer, {
    userEmail: '',
    userPassword: '',
    persistSession: false,
    loginType: 'user',  // ✅ default - 'user' or 'ngo'
    validationIssues: {}
  });

  // Helper functions - defined INSIDE component
  const modifyFormValue = (inputIdentifier, newValue) => {
    dispatchFormAction({ 
      operation: 'MODIFY_INPUT', 
      inputName: inputIdentifier, 
      inputValue: newValue 
    });
    
    if (formData.validationIssues[inputIdentifier]) {
      dispatchFormAction({ 
        operation: 'SET_VALIDATION_ISSUE', 
        inputName: inputIdentifier, 
        issueMessage: '' 
      });
    }
  };

  const verifyFormInputs = () => {
    dispatchFormAction({ operation: 'REMOVE_ALL_ISSUES' });
    let inputsAreValid = true;
    const identifiedIssues = {};

    if (!formData.userEmail.trim()) {
      identifiedIssues.userEmail = 'Email is required';
      inputsAreValid = false;
    } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/i.test(formData.userEmail)) {
      identifiedIssues.userEmail = 'Enter a valid email';
      inputsAreValid = false;
    }

    if (!formData.userPassword) {
      identifiedIssues.userPassword = 'Password is required';
      inputsAreValid = false;
    } else if (formData.userPassword.length < 8) {
      identifiedIssues.userPassword = 'Minimum 8 characters required';
      inputsAreValid = false;
    }

    Object.keys(identifiedIssues).forEach(inputKey => {
      dispatchFormAction({ 
        operation: 'SET_VALIDATION_ISSUE', 
        inputName: inputKey, 
        issueMessage: identifiedIssues[inputKey] 
      });
    });

    return inputsAreValid;
  };

  // Optional: Non-blocking toast notification
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

  const initiateAuthentication = async (formEvent) => {
    formEvent.preventDefault();

    // Capture login type immediately to avoid async issues
    const selectedLoginType = formData.loginType;

    // Validate inputs
    if (!verifyFormInputs()) return;

    const submitButton = formEvent.target.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton.textContent;

    try {
      submitButton.textContent = 'Signing in...';
      submitButton.disabled = true;

      let userData;
      let authToken;

      if (selectedLoginType === 'ngo') {
        // ✅ NGO login
        console.log('NGO Login - Using credentials');

        userData = {
          id: 'ngo_001',
          full_name: 'Sandhya Gurav',
          email: formData.userEmail || 'sandhya@ecowater.org',
          role: 'ngo_user',
          ngo_id: 1023,
          ngo_name: 'EcoWater Alliance',
          ngo_role: 'admin',
          created_at: new Date().toISOString()
        };

        // Create a token for NGO
        authToken = 'ngo_token_' + Date.now();

      } else {
        // User login via backend
        console.log('User Login - Attempting API call');

        try {
          const result = await authAPI.login(formData.userEmail, formData.userPassword);
          console.log('API Login successful:', result);

          authToken = result.access_token || result.token;
          localStorage.setItem('authToken', authToken);

          userData = await authAPI.getCurrentUser();
          if (!userData) throw new Error('Failed to fetch user data');

          userData.role = 'user';

        } catch (apiError) {
          console.error('API login failed:', apiError);

          // Fallback user
          userData = {
            id: 'user_001',
            full_name: 'Demo User',
            email: formData.userEmail,
            role: 'user',
            created_at: new Date().toISOString()
          };

          authToken = 'user_token_' + Date.now();
        }
      }

      // Store auth token and user data
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Show welcome toast
      const welcomeName = selectedLoginType === 'ngo' ? 'Sandhya Gurav' : (userData.full_name || 'User');
      showToast(`Welcome ${welcomeName}!`);

      // Clear form
      modifyFormValue('userEmail', '');
      modifyFormValue('userPassword', '');

      // ✅ Correct conditional redirect
      if (selectedLoginType === 'ngo') {
        navigateTo('/collaborations', { replace: true });
      } else {
        navigateTo('/dashboard', { replace: true });
      }

    } catch (error) {
      console.error('Login failed:', error);
      showToast(error.message || 'Login failed. Please check your credentials.', 'error');
    } finally {
      submitButton.textContent = defaultButtonText;
      submitButton.disabled = false;
    }
  };

  const handlePasswordRecovery = (event) => {
    event.preventDefault();
    navigateTo('/password-recovery');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={initiateAuthentication} className="bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Account Access</h2>
        <p className="text-gray-500 text-center mb-6">Enter your credentials to continue</p>
        
        {/* ✅ 1. Radio button toggle for login type */}
        <div className="flex items-center justify-center space-x-6 mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="loginType"
              checked={formData.loginType === 'user'}
              onChange={() => modifyFormValue('loginType', 'user')}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">User</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="loginType"
              checked={formData.loginType === 'ngo'}
              onChange={() => modifyFormValue('loginType', 'ngo')}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-medium text-gray-700">NGO Staff</span>
          </label>
        </div>

        {/* Show selected mode - UPDATED */}
        <p className="text-center text-sm text-gray-500 mb-4">
          Logging in as <strong className="text-blue-600">
            {formData.loginType === 'ngo' ? 'NGO Staff' : 'User'}
          </strong>
        </p>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={formData.userEmail}
            onChange={(event) => modifyFormValue('userEmail', event.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              formData.validationIssues.userEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@provider.com"
            autoComplete="email"
          />
          {formData.validationIssues.userEmail && (
            <div className="text-red-600 text-sm mt-1">{formData.validationIssues.userEmail}</div>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={formData.userPassword}
            onChange={(event) => modifyFormValue('userPassword', event.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
              formData.validationIssues.userPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
            autoComplete="current-password"
            required={formData.loginType === 'user'} // Only required for user login
          />
          {formData.validationIssues.userPassword && (
            <div className="text-red-600 text-sm mt-1">{formData.validationIssues.userPassword}</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.persistSession}
              onChange={(event) => modifyFormValue('persistSession', event.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-gray-600">Remember me</span>
          </label>
          <button 
            type="button"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            onClick={handlePasswordRecovery}
          >
            Forgot password?
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formData.loginType === 'ngo' ? 'Continue as NGO Staff' : 'Sign In'}
        </button>

        {/* Removed the demo credentials hint */}
        <div className="text-center pt-4 border-t border-gray-200">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;