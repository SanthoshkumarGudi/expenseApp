import React, { useState } from 'react';
import { authService } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import {VerifyEmail} from './VerifyEmail';

export function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setServerError(null);

    try {
        const payload = {
            full_name: formData.fullName,     // ← Important: snake_case
            email: formData.email,
            password: formData.password,
            // org_id is now optional - backend will handle it
        };

        const response = await authService.register(payload);
        console.log('Registration Response:', response);

        if (response) {
          navigate('/verify-email/', {
            state: {
              email: formData.email,
              message: 'Registration successful! Please check your email to verify your account.',
            },
            replace: true,
          });
        } 
  
        else {
          setServerError(response.message || 'Registration failed');
        }
        // navigate('/verify-email', { state: { email: formData.email } }); // in the backend there is no dedicated endpoint for resending verification email, so we will just show a message to check their email
        // navigate('/auth', { state: { message: 'Registration successful! Please check your email to verify your account.' } });
        
    } catch (error) {
        console.error("Registration Error:", error.response?.data);
        setServerError(error.response?.data?.detail?.[0]?.msg || 
                      error.response?.data?.message || 
                      'Registration failed');
    } finally {
        setIsLoading(false);
    }
};

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight text-center">Create your account</h1>
      <p className="mt-2 text-center text-gray-600">Join us to get started</p>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        {serverError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded border border-red-200">
            {serverError}
          </div>
        )}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700">Org Id</label>
          
          <input 
            type="text" 
            name="org_id" 
            value={formData.org_id}
            onChange={handleChange}
            placeholder="Acme Corporation"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.org_id && <span className="text-sm text-red-600 mt-1 block">{errors.org_id}</span>}
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.fullName && <span className="text-sm text-red-600 mt-1 block">{errors.fullName}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && <span className="text-sm text-red-600 mt-1 block">{errors.email}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.password && <span className="text-sm text-red-600 mt-1 block">{errors.password}</span>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword" 
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.confirmPassword && <span className="text-sm text-red-600 mt-1 block">{errors.confirmPassword}</span>}
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      
      <p className="text-center text-xs text-gray-500 mt-4">
        By signing up you agree to our{' '}
        <a href="#" className="text-blue-600 hover:underline">Terms</a>
      </p>
    </>
  );
}
