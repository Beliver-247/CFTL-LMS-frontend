import { useState } from "react";
import { auth } from "../../firebase";
import { useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function AdminLogin() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const checkIfAlreadyLoggedIn = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const res = await axios.get(`${baseURL}/api/admins/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { fullName, nameInitials, telephone, role } = res.data;

      if (!fullName?.trim() || !nameInitials?.trim() || !telephone?.trim()) {
        navigate("/admin-complete-profile");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      // If error occurs, just stay on login page
      console.error("Auto-login check failed:", err);
    }
  };

  checkIfAlreadyLoggedIn();
}, []);

  // 🔍 Checks if user is invited before allowing profile access
  const checkInvite = async (email) => {
    try {
      const res = await axios.get(`${baseURL}/api/admins/check-invite`, {
        params: { email },
      });
      return res.status === 200;
    } catch (err) {
      return false;
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCred.user.email;

      const invited = await checkInvite(userEmail);
      if (!invited) {
        setError("You are not invited to access the admin portal.");
        await auth.signOut();
        return;
      }

      const token = await userCred.user.getIdToken();
      localStorage.setItem("adminToken", token);
      await checkProfileAndNavigate(token);
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
      const userEmail = result.user.email;

      const invited = await checkInvite(userEmail);
      if (!invited) {
        setError("You are not invited to access the admin portal.");
        await auth.signOut();
        return;
      }

      const token = await result.user.getIdToken();
      localStorage.setItem("adminToken", token);
      localStorage.setItem("userRole", "admin"); // Store role for Navbar
      await checkProfileAndNavigate(token);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setGoogleLoading(false);
    }
  };

const checkProfileAndNavigate = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/api/admins/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { fullName, nameInitials, telephone, role } = res.data;

    // ✅ Store role in localStorage for Navbar
    localStorage.setItem("userRole", role);

    if (!fullName?.trim() || !nameInitials?.trim() || !telephone?.trim()) {
      navigate("/admin-complete-profile");
    } else {
      navigate("/admin-dashboard");
    }
  } catch (err) {
    const status = err.response?.status;
    const message = err.response?.data?.error;

    if (status === 403 && message?.includes("Unauthorized")) {
      setError("You are not authorized to access the admin portal.");
      auth.signOut();
      localStorage.removeItem("adminToken");
      return;
    }

    if (status === 404) {
      navigate("/admin-complete-profile");
    } else {
      setError("An unexpected error occurred.");
    }
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-700 py-6 px-8 text-center">
          <FaUserShield className="mx-auto text-4xl text-white mb-2" />
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-blue-100 mt-1">Access the admin portal</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in with Email"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className={`w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                  googleLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {googleLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
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
          </div>
        </div>
      </div>
    </div>
  );
}
