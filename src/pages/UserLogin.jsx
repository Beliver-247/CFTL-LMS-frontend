// UserLogin.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import loginBg from '../assets/pexels-lum3n-44775-167682.jpg'; 
import logo from '../assets/textLogo.png'; // Assuming you have a logo image

export default function UserLogin() {
  return (
    <div className="flex h-screen font-sans">
      {/* Left Panel with background image and red overlay */}
      <div
        className="w-1/2 relative flex items-center justify-center text-white px-8"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Red overlay */}
        <div className="absolute inset-0 bg-red-800 opacity-80 z-0"></div>

        {/* Animated Content */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="mb-6">
<img src={logo} alt="CFTL Logo" className="mx-auto h-16 md:h-20 lg:h-24 w-auto" />


          </div>
          {/* <h1 className="text-3xl font-bold mb-4">COLLEGE OF FAST TRACK LEARNING</h1> */}
<p className="text-sm text-red-100 max-w-md">
  Join a community where ambition meets opportunity. At CFTL, we empower learners to fast-track their academic journey with cutting-edge digital tools, expert guidance, and nationally recognized programs.
</p>

        </motion.div>
      </div>

      {/* Right Panel with login options */}
      <motion.div
        className="w-1/2 bg-white flex flex-col justify-center items-center space-y-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <Link
          to="/parent-login"
          className="w-2/3 text-center px-6 py-3 bg-red-700 text-white rounded-md text-lg font-semibold hover:bg-red-600"
        >
          PARENT
        </Link>
        <Link
          to="/teacher-login"
          className="w-2/3 text-center px-6 py-3 bg-red-700 text-white rounded-md text-lg font-semibold hover:bg-red-600"
        >
          TEACHER
        </Link>
        <Link
          to="/coordinator-login"
          className="w-2/3 text-center px-6 py-3 bg-red-700 text-white rounded-md text-lg font-semibold hover:bg-red-600"
        >
          COORDINATOR 
        </Link>
      </motion.div>
    </div>
  );
}
