import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import InfoHeader from './InfoHeader';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

// Replace this with your actual reCAPTCHA site key
const RECAPTCHA_SITE_KEY = '6LdtRdkqAAAAALPaCtkcECR330pwY2PJj8jYRnDz';

export const LoginForm = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!recaptchaToken) {
      setError('Please complete the captcha');
      setLoading(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('recaptcha_token', recaptchaToken);

      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', formData.email);
      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
    <br />
    <br />
      <InfoHeader />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 text-left">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-center my-4">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken('')}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={loading || !recaptchaToken}
              >
                {loading ? 'Processing...' : 'Login'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="ml-2 text-black hover:underline focus:outline-none"
                  disabled={loading}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export const SignupForm = ({ onSignupSuccess }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState('');

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSuccess(false);
    setLoading(true);

    if (!recaptchaToken) {
      setError('Please complete the captcha');
      setLoading(false);
      return;
    }

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);
      formDataObj.append('recaptcha_token', recaptchaToken);

      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        body: formDataObj,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Something went wrong');
      }

      setIsSuccess(true);
      setError('Account created successfully! Redirecting to login...');
      onSignupSuccess && onSignupSuccess();
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
    <br />
    <br />
      <InfoHeader />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md p-6 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              Sign Up
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className={`mb-4 p-2 text-sm rounded border ${
                isSuccess
                  ? 'text-green-600 bg-green-50 border-green-200'
                  : 'text-red-600 bg-red-50 border-red-200'
              }`}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 text-left">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 text-left">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-center my-4">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => setRecaptchaToken(token)}
                  onExpired={() => setRecaptchaToken('')}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
                disabled={loading || formData.password !== formData.confirmPassword || !recaptchaToken}
              >
                {loading ? 'Processing...' : 'Sign Up'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="ml-2 text-black hover:underline focus:outline-none"
                  disabled={loading}
                >
                  Login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SignupForm;
