import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords must match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Passwords must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://scalerailabassignment-production-2abd.up.railway.app/api';
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onLogin(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Amazon Logo */}
      <div className="flex justify-center py-6">
        <Link to="/" className="flex items-center">
          <span className="text-3xl font-bold text-black">amazon</span>
          <span className="text-2xl">.in</span>
        </Link>
      </div>

      {/* Register Container */}
      <div className="flex-1 flex items-start justify-center pt-10 px-4">
        <div className="w-full max-w-sm">
          <div className="border border-gray-300 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-normal mb-4">Create account</h2>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 mb-4">
                <div className="flex items-center">
                  <span className="text-xl mr-2">⚠</span>
                  <p className="text-sm font-bold">There was a problem</p>
                </div>
                <p className="text-sm ml-7">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-bold mb-1">
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="First and last name"
                  className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm focus:outline-none focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:border-orange-400"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-bold mb-1">
                  Mobile number or email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm focus:outline-none focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:border-orange-400"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-bold mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm focus:outline-none focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:border-orange-400"
                  required
                />
                <p className="text-xs text-gray-700 mt-1">
                  ⓘ Passwords must be at least 6 characters.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">
                  Re-enter password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm focus:outline-none focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:border-orange-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 border border-yellow-600 text-black text-sm font-normal py-1.5 rounded shadow-sm transition disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Continue'}
              </button>
            </form>

            <p className="text-xs text-gray-700 mt-4 leading-relaxed">
              By creating an account, you agree to Amazon's{' '}
              <a href="#" className="text-blue-600 hover:text-orange-600 hover:underline">
                Conditions of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-orange-600 hover:underline">
                Privacy Notice
              </a>
              .
            </p>

            <div className="mt-4 pt-4 border-t border-gray-300">
              <p className="text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-orange-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center mb-6">
            Buying for work?{' '}
            <a href="#" className="text-blue-600 hover:text-orange-600 hover:underline">
              Create a free business account
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
        <div className="border-t border-gray-300 bg-gradient-to-b from-gray-100 to-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="flex justify-center gap-6 text-xs text-blue-600 mb-2">
              <a href="#" className="hover:text-orange-600 hover:underline">Conditions of Use</a>
              <a href="#" className="hover:text-orange-600 hover:underline">Privacy Notice</a>
              <a href="#" className="hover:text-orange-600 hover:underline">Help</a>
            </div>
            <div className="text-center text-xs text-gray-600">
              © 1996-2026, Amazon.com, Inc. or its affiliates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
