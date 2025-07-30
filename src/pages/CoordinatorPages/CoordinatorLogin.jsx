import { useState, useEffect } from "react";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUserTie, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import backgroundImage from "../../assets/pexels-lum3n-44775-167682.jpg";

export default function CoordinatorLogin() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${baseURL}/api/admins/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { role } = res.data || {};
        if (role === "coordinator") {
          navigate("/coordinator-dashboard");
        }
      } catch {}
    };

    checkIfLoggedIn();
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      localStorage.setItem("adminToken", token);
      localStorage.setItem("userRole", "coordinator");
      localStorage.setItem("activeRole", "coordinator");

      const res = await axios.get(`${baseURL}/api/admins/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { role } = res.data || {};
      if (role === "coordinator" || role === "admin") {
        navigate("/coordinator-dashboard");
      } else {
        setError("Access denied. You are not authorized.");
        await auth.signOut();
        localStorage.removeItem("adminToken");
        return;
      }

      navigate("/coordinator-dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
const res = await axios.get(`${baseURL}/api/admins/me`, {
  headers: { Authorization: `Bearer ${token}` },
});

const { role } = res.data || {};
if (role !== 'coordinator' && role !== 'admin') {
  setError('Access denied.');
  await auth.signOut();
  localStorage.removeItem('adminToken');
  return;
}

localStorage.setItem('adminToken', token);
localStorage.setItem('userRole', role); // Use actual role
localStorage.setItem('activeRole', 'coordinator'); // Still acting as coordinator

navigate('/coordinator-dashboard');

    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
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
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-6">
          <FaUserTie className="mx-auto text-4xl mb-3" />
          <h2 className="text-2xl font-bold">COORDINATOR LOGIN</h2>
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
            {isLoading ? "Signing in..." : "LOGIN"}
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
              "Signing in..."
            ) : (
              <>
                <FcGoogle className="mr-2" /> Google
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-200">
          Not a coordinator?{" "}
          <a
            href="/admin-login"
            className="text-blue-300 hover:underline font-medium"
          >
            Go to Admin Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}
