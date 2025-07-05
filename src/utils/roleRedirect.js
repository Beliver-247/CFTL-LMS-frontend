// utils/roleRedirect.js
export function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.role || 'admin'; // fallback
  } catch {
    return 'admin';
  }
}
