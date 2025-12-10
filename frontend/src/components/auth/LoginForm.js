import React, { useReducer } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

const AuthenticationForm = () => {
  const navigateTo = useNavigate();
  const [formData, dispatchFormAction] = useReducer(formReducer, {
    userEmail: '',
    userPassword: '',
    persistSession: false,
    validationIssues: {}
  });

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
    } else if (formData.userPassword.length < 6) {
      identifiedIssues.userPassword = 'Minimum 6 characters required';
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

  const initiateAuthentication = async (formEvent) => {
    formEvent.preventDefault();
    
    if (!verifyFormInputs()) return;

    const submitButton = formEvent.target.querySelector('button[type="submit"]');
    const defaultButtonText = submitButton.textContent;
    
    try {
      submitButton.textContent = 'Signing in...';
      submitButton.disabled = true;

      await new Promise(resolve => setTimeout(resolve, 1300));
      
      const authenticationPayload = {
        email: formData.userEmail,
        password: formData.userPassword,
        rememberMe: formData.persistSession
      };
      
      console.log('Login attempt:', authenticationPayload);
      alert('Login successful!');
      
      modifyFormValue('userEmail', '');
      modifyFormValue('userPassword', '');
      
    } catch (authenticationError) {
      console.warn('Login failed:', authenticationError);
      alert('Login failed. Please check your credentials.');
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          Sign In
        </button>

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

export default AuthenticationForm;