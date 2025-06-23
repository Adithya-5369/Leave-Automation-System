import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { login, verifyOtp, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      setShowOtpInput(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  /* const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await verifyOtp(otp);
      if (success) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  }; */

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const success = await verifyOtp(otp);
      if (success) {
        navigate('/dashboard');
      }      
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-orange-500 p-6 flex items-center justify-center">
        <div className="logo-container"> <img src="images/logo.png" className="logo" /> </div>
          <div className="ml-4 text-white">
            <h1 className="text-2xl font-bold">NIT Andhra Pradesh</h1>
            <p className="text-orange-100">Faculty Leave Automation</p>
          </div>
        </div>
        
        <div className="p-8">
          {!showOtpInput ? (
            <form onSubmit={handleLogin}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h2>
              
              <div className="mb-4">
                <label htmlFor="email" className="form-label">Institute Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    className="form-input pl-10"
                    placeholder="username@nitandhra.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    className="form-input pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>

              <div className="text-right text-sm mt-2">
                <button
                  type="button"
                  onClick={() => navigate('/reset-password')}
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* <div className="mt-4 text-center text-sm text-gray-600">
                <p className="mt-1">
                  <span className="font-semibold">Faculty:</span> faculty@nitandhra.ac.in
                </p>
                <p>
                  <span className="font-semibold">HoD:</span> hod@nitandhra.ac.in
                </p>
                <p>
                  <span className="font-semibold">Dean:</span> dean@nitandhra.ac.in
                </p>
                <p>
                  <span className="font-semibold">Registrar:</span> registrar@nitandhra.ac.in
                </p>
                <p>
                  <span className="font-semibold">Dy. Director:</span> dydirector@nitandhra.ac.in
                </p>
                <p>
                  <span className="font-semibold">Password:</span> password
                </p>
              </div> */}
            </form>
          ) : (
            <form onSubmit={handleOtpVerification}>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">OTP Verification</h2>
              <p className="mb-4 text-gray-600">
                A one-time password has been sent to your email address. Please enter it below.
              </p>
              
              <div className="mb-6">
                <label htmlFor="otp" className="form-label">One-Time Password</label>
                <input
                  id="otp"
                  type="text"
                  className="form-input"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                {/* <p className="mt-2 text-sm text-gray-500">
                  For demo, use: <span className="font-medium">123456</span>
                </p> */}
              </div>
              
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
              
              <button
                type="button"
                className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setShowOtpInput(false)}
              >
                Back to Login
              </button>
            </form>
          )}

          {!showOtpInput && (
            <div className="mt-4 text-center text-sm text-gray-600">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-blue-600 hover:underline ml-1"
              >
                Register
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;