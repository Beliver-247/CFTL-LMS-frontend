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
        try {
          const token = await user.getIdToken();
          localStorage.setItem("adminToken", token);

          const res = await axios.get(`${baseURL}/api/admins/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const { fullName, nameInitials, telephone, role } = res.data || {};

          const isProfileIncomplete =
            !fullName?.trim() || !nameInitials?.trim() || !telephone?.trim();

          if (isProfileIncomplete) {
            setRedirectPath('/admin-complete-profile');
          } else if (role === 'coordinator') {
            setRedirectPath('/coordinator-dashboard');
          } else if (role === 'admin') {
            setRedirectPath('/admin-dashboard');
          } else {
            // Unknown role fallback
            setRedirectPath('/');
          }
        } catch (err) {
          if (err.response?.status === 404) {
            // Invited user or no profile
            setRedirectPath('/admin-complete-profile');
          } else {
            console.error('Redirect failed:', err);
            localStorage.removeItem("adminToken");
            await auth.signOut();
            setRedirectPath('/admin-login');
          }
        } finally {
          setLoading(false); // ✅ Ensure this runs regardless
        }
      } else {
        setLoading(false); // Not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null;
  if (redirectPath) return <Navigate to={redirectPath} replace />;

  return children;
}
