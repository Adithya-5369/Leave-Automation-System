import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const roles = ['adhoc', 'faculty', 'hod', 'dean', 'registrar', 'director'];

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    department: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, password, role, department } = formData;
    if (!name || !email || !password || !role || !department) {
      return toast.error('All fields are required');
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      toast.success('Registered successfully!');
      navigate('/login');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-orange-500 p-6 flex items-center justify-center">
          <div className="logo-container">
            <img src="/images/logo.png" alt="logo" className="h-10 w-10" />
          </div>
          <div className="ml-4 text-white">
            <h1 className="text-2xl font-bold">NIT Andhra Pradesh</h1>
            <p className="text-orange-100">Faculty Leave Automation</p>
          </div>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">Register</h2>

            <div className="relative">
              <User className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="form-input pl-10"
              />
            </div>

            <div className="relative">
              <Mail className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Institute Email"
                value={formData.email}
                onChange={handleChange}
                className="form-input pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="form-input pl-10"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input pl-10"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Briefcase className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                className="form-input pl-10"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center"
            >
              Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            Already have an account?{' '}
            <span
              className="text-orange-600 hover:underline cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
