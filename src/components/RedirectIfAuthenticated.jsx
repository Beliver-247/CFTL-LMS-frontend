// components/RedirectIfAuthenticated.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';
import axios from 'axios';

export default function RedirectIfAuthenticated({ children }) {
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        try {
          const res = await axios.get(`${baseURL}/admins/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { fullName, nameInitials, telephone, role } = res.data || {};

          const isProfileIncomplete =
            !fullName?.trim() || !nameInitials?.trim() || !telephone?.trim();

          if (isProfileIncomplete) {
            setRedirectPath('/admin-complete-profile');
          } else if (role === 'coordinator') {
            setRedirectPath('/coordinator-dashboard');
          } else {
            setRedirectPath('/admin-dashboard');
          }
        } catch {
          // Let them stay on login page if anything fails
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return children;
}
