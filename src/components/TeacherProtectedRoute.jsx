import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function TeacherProtectedRoute({ element: Component }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("userRole");

      if (!token || role !== "teacher") {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/api/teachers/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        console.error("Teacher auth check failed:", err);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!isAuthorized) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    return <Navigate to="/teacher-login" replace />;
  }

  return <Component />;
}
