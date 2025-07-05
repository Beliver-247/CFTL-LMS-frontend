import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ element: Component, allowedRoles }) {
  // Map token key to user role
  const roleMap = {
    adminToken: 'admin',     // also includes 'coordinator'
    teacherToken: 'teacher',
    token: 'parent'
  };

  const tokenKey = Object.keys(roleMap).find((key) => localStorage.getItem(key));
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    // Redirect to appropriate login page
    if (allowedRoles.includes('parent')) return <Navigate to="/parent-login" replace />;
    if (allowedRoles.includes('teacher')) return <Navigate to="/teacher-login" replace />;
    return <Navigate to="/admin-login" replace />;
  }

  try {
    let role = roleMap[tokenKey];

    // Optional: for adminToken, decode to get actual role (admin/coordinator)
    if (tokenKey === 'adminToken') {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload?.role || 'admin';
    }

    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }

    return <Component />;
  } catch (err) {
    // Token corrupted or invalid
    if (tokenKey === 'token') return <Navigate to="/parent-login" replace />;
    if (tokenKey === 'teacherToken') return <Navigate to="/teacher-login" replace />;
    return <Navigate to="/admin-login" replace />;
  }
}
