import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ element: Component, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        // Route to correct login page
        if (allowedRoles.includes('parent')) return setRedirectPath('/parent-login');
        if (allowedRoles.includes('teacher')) return setRedirectPath('/teacher-login');
        return setRedirectPath('/admin-login');
      }

      try {
        const res = await axios.get(`${baseURL}/api/admins/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = res.data?.role || 'admin';
        if (allowedRoles.includes(role)) {
          setIsAuthorized(true);
        }
      } catch (err) {
        console.error('ProtectedRoute check failed:', err);
        setRedirectPath('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [allowedRoles]);

  if (loading) return null;

  if (isAuthorized) return <Component />;

  return <Navigate to={redirectPath} replace />;
}
