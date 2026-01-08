import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://scalerailabassignment-production-2abd.up.railway.app/api';
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      onLogin(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Amazon Logo - Centered */}
      <div className="flex justify-center py-6">
        <Link to="/" className="flex items-center">
          <span className="text-3xl font-bold text-black">amazon</span>
          <span className="text-2xl">.in</span>
        </Link>
      </div>

      {/* Login Container - Centered */}
      <div className="flex-1 flex items-start justify-center pt-10 px-4">
        <div className="w-full max-w-sm">
          <div className="border border-gray-300 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-normal mb-4">Sign in</h2>

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
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">
                  Email or mobile phone number
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm focus:outline-none focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:border-orange-400"
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-bold">
                    Password
                  </label>
                  <a href="#" className="text-xs text-blue-600 hover:text-orange-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-400 rounded px-3 py-1.5 text-sm focus:outline-none focus:shadow-[0_0_3px_2px_rgba(228,121,17,0.5)] focus:border-orange-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 border border-yellow-600 text-black text-sm font-normal py-1.5 rounded shadow-sm transition disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Continue'}
              </button>
            </form>

            <p className="text-xs text-gray-700 mt-4 leading-relaxed">
              By continuing, you agree to Amazon's{' '}
              <a href="#" className="text-blue-600 hover:text-orange-600 hover:underline">
                Conditions of Use
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-orange-600 hover:underline">
                Privacy Notice
              </a>
              .
            </p>

            <details className="mt-4">
              <summary className="text-xs text-blue-600 hover:text-orange-600 cursor-pointer">
                ▸ Need help?
              </summary>
            </details>
          </div>

          {/* New to Amazon Section */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-white text-gray-500">New to Amazon?</span>
            </div>
          </div>

          <Link
            to="/register"
            className="block text-center bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-400 text-black text-sm py-1.5 rounded shadow-sm transition"
          >
            Create your Amazon account
          </Link>
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

export default Login;
