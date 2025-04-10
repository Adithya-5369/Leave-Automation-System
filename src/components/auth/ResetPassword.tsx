import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [stage, setStage] = useState<'request' | 'verify'>('request');
  const navigate = useNavigate();
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingOtp(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/request-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP request failed');
  
      toast.success('OTP sent to your email');
      setStage('verify');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(errorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };
  
  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Password reset failed');
  
      toast.success('Password reset successful');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setIsResetting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-orange-500 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-orange-100 mt-1">Faculty Leave Automation</p>
        </div>

        <div className="p-8">
          {stage === 'request' ? (
            <form onSubmit={requestOtp}>
              <div className="mb-6">
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

              <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={isSendingOtp}>
                {isSendingOtp ? 'Sending...' : 'Send OTP'}
                {!isSendingOtp && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>
          ) : (
            <form onSubmit={resetPassword}>
              <div className="mb-4">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input
                  id="otp"
                  type="text"
                  className="form-input"
                  placeholder="Enter OTP sent to email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    className="form-input pl-10"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={isResetting}>
                {isResetting ? 'Resetting...' : 'Reset Password'}
                {!isResetting && <ArrowRight className="ml-2 h-4 w-4" />}
              </button>
            </form>
          )}

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full text-center text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
