import { useState } from "react";
import { auth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserTie, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function CoordinatorLogin() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const checkInvite = async (email) => {
    try {
      const res = await axios.get(`${baseURL}/api/admins/check-invite`, {
        params: { email },
      });
      return res.status === 200;
    } catch {
      return false;
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCred.user.getIdToken();
      localStorage.setItem("adminToken", token);

      const res = await axios.get(`${baseURL}/api/admins/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { role } = res.data || {};
      if (role !== "coordinator") {
        setError("Access denied. You are not a coordinator.");
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
      localStorage.setItem("adminToken", token);

      const res = await axios.get(`${baseURL}/api/admins/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { role } = res.data || {};
      if (role !== "coordinator") {
        setError("Access denied. You are not a coordinator.");
        await auth.signOut();
        localStorage.removeItem("adminToken");
        return;
      }

      navigate("/coordinator-dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-indigo-700 py-6 px-8 text-center">
          <FaUserTie className="mx-auto text-4xl text-white mb-2" />
          <h2 className="text-2xl font-bold text-white">Coordinator Login</h2>
          <p className="text-indigo-100 mt-1">Access the coordinator dashboard</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in with Email"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-2">Or continue with</p>
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              {googleLoading ? "Signing in..." : <><FcGoogle className="mr-2" /> Google</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
