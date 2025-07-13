// Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
  FaGraduationCap,
  FaUser,
  FaChalkboardTeacher,
  FaBars,
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState('guest');
  const path = location.pathname;

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'guest';
    setUserType(role);
  }, [location]);

  const roleItems = {
    guest: [],
    teacher: [
      { path: '/teacher-dashboard', name: 'Dashboard', icon: <FaChalkboardTeacher className="mr-1" /> },
      { path: '/teacher-courses', name: 'Courses' },
      { path: '/teacher-students', name: 'Students' },
      { path: '/teacher-profile', name: 'Profile', icon: <FaUser className="mr-1" /> }
    ],
    parent: [
      { path: '/parent-dashboard', name: 'Dashboard' },
      { path: '/view-payment-requests', name: 'View Payment Requests' },
      { path: '/parent-profile', name: 'Profile', icon: <FaUser className="mr-1" /> }
    ],
    student: [
      { path: '/student-dashboard', name: 'Dashboard', icon: <FaGraduationCap className="mr-1" /> },
      { path: '/student-courses', name: 'My Courses' },
      { path: '/student-grades', name: 'Grades' },
      { path: '/student-profile', name: 'Profile', icon: <FaUser className="mr-1" /> }
    ],
    admin: [
      { path: '/admin-dashboard', name: 'Dashboard', icon: <FaUser className="mr-1" /> },
      { path: '/admin/manage-courses', name: 'Manage Courses' },
      { path: '/admin/manage-subjects', name: 'Manage Subjects' },
      { path: '/admin/courses/create', name: 'Create Course' },
      { path: '/admin/set-role', name: 'Set Roles' }
    ],
    coordinator: [
      { path: '/coordinator-dashboard', name: 'Dashboard', icon: <FaUser className="mr-1" /> },
      { path: '/coordinator/manage-payment-requests', name: 'Manage Payments' },
      { path: '/coordinator/enrolled-students', name: 'View Enrolled Students' }
    ]
  };

  let currentNavItems = roleItems[userType] || [];

  if (userType === 'coordinator' && path.startsWith('/admin')) {
    currentNavItems = roleItems['admin'];
  } else if (userType === 'admin' && path.startsWith('/coordinator')) {
    currentNavItems = roleItems['coordinator'];
  }

  const navItems = currentNavItems;

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error('Firebase sign out failed:', err);
    }

    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');

    if (userType === 'admin') {
      navigate('/admin-login');
    } else if (userType === 'coordinator') {
      navigate('/coordinator-login');
    } else if (userType === 'teacher') {
      navigate('/teacher-login');
    } else if (userType === 'parent') {
      navigate('/parent-login');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-red-800 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-80">
              <FaGraduationCap className="h-8 w-8 text-red-200" />
              <span className="ml-2 text-xl font-bold">CFTL LMS</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                      path === item.path
                        ? 'bg-red-700 text-white'
                        : 'text-red-200 hover:bg-red-700 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {userType !== 'guest' ? (
                <>
                  <span className="text-red-200 mr-4 capitalize">
                    Welcome, {path.includes('/admin') ? 'admin' : userType}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 bg-white text-red-700 rounded-md text-sm font-medium hover:bg-red-100"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white text-red-700 rounded-md text-sm font-medium hover:bg-red-100"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-red-200 hover:text-white hover:bg-red-700 focus:outline-none"
            >
              {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  path === item.path
                    ? 'bg-red-700 text-white'
                    : 'text-red-200 hover:bg-red-700 hover:text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-red-700">
            {userType !== 'guest' ? (
              <div className="px-5">
                <div className="text-base font-medium text-white capitalize mb-2">
                  Welcome, {path.includes('/admin') ? 'admin' : userType}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-200 hover:text-white hover:bg-red-700"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-red-200 hover:text-white hover:bg-red-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
