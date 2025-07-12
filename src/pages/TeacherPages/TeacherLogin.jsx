import { useState } from 'react';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import backgroundImage from '../../assets/pexels-lum3n-44775-167682.jpg';

export default function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'teacher');
      navigate('/teacher-dashboard');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', 'teacher');

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/teachers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 404) {
        navigate('/teacher-complete-profile');
      } else if (res.ok) {
        navigate('/teacher-dashboard');
      } else {
        const data = await res.json();
        setError(data?.error || 'Unexpected error occurred');
      }
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setGoogleLoading(false);
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
          <FaChalkboardTeacher className="mx-auto text-4xl mb-3" />
          <h2 className="text-2xl font-bold">TEACHER LOGIN</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-80 text-white rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Enter Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-200 mb-2">Or continue with</p>
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-full text-gray-800 bg-white hover:bg-gray-50"
          >
            {googleLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <FcGoogle className="h-5 w-5 mr-2" />
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-200">
          Don&apos;t have an account?{' '}
          <a href="/teacher-register" className="text-blue-300 hover:underline font-medium">
            Register here
          </a>
        </div>
      </motion.div>
    </div>
  );
}