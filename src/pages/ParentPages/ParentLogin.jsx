import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import backgroundImage from '../../assets/pexels-lum3n-44775-167682.jpg';

export default function ParentLogin() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [nic, setNic] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${baseURL}/api/auth/parents`, { nic, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'parent');
      navigate('/parent-dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0" />

      <motion.div
        className="relative z-10 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-lg p-8 max-w-md w-full text-white"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="text-center mb-6">
          <img
            src="../../assets/logo.jpg"
            alt="CFTL Logo"
            className="mx-auto h-16 mb-2"
          />
          <h2 className="text-2xl font-bold">COLLEGE OF FAST TRACK LEARNING</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-80 text-white rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Enter Your NIC"
            value={nic}
            onChange={(e) => setNic(e.target.value)}
            required
            className="w-full py-3 px-4 rounded-full bg-white bg-opacity-90 text-gray-900 placeholder-gray-500 focus:outline-none"
          />

          <input
            type="password"
            placeholder="Enter Your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full py-3 px-4 rounded-full bg-white bg-opacity-90 text-gray-900 placeholder-gray-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-red-700 hover:bg-red-600 transition-colors font-semibold flex justify-center items-center"
          >
            {isLoading ? 'Signing in...' : (<><span>LOGIN</span> <FaArrowRight className="ml-2" /></>)}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
