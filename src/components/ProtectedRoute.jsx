import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ element: Component, allowedRoles }) {
  const roleMap = {
    adminToken: 'admin', // fallback if decoding fails
    teacherToken: 'teacher',
    token: 'parent'
  };

  const tokenKey = Object.keys(roleMap).find((key) => localStorage.getItem(key));
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    if (allowedRoles.includes('parent')) return <Navigate to="/parent-login" replace />;
    if (allowedRoles.includes('teacher')) return <Navigate to="/teacher-login" replace />;
    return <Navigate to="/admin-login" replace />;
  }

  let role;

  try {
    if (tokenKey === 'adminToken') {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload?.role || 'admin';
    } else {
      role = roleMap[tokenKey];
    }

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
}
