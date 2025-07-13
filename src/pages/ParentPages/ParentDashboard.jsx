import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaChild,
  FaUserGraduate,
  FaCalendarAlt,
  FaFileAlt,
  FaMoneyBillWave,
  FaClipboardList,
  FaSignOutAlt,
  FaUser,
  FaPhone,
  FaSchool,
  FaHeartbeat,
  FaBook
} from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ParentDashboard() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/parent-login');

    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/parents/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not fetch child records.');
      }
    };

    fetchStudents();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/parent-login');
  };

  if (error) return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    </div>
  );

  if (!students.length) return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
      <div className="bg-white text-gray-700 rounded-xl shadow-md p-6 mt-4 text-center">
        <p>No child records found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-90 text-white px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-3">
            <FaUserGraduate className="text-3xl text-red-200" />
            <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              title: 'Payment Status',
              icon: <FaMoneyBillWave className="text-red-700 text-xl" />,
              bg: 'bg-red-100',
              desc: 'View fee payment history',
              onClick: () => navigate('/payment-status')
            },
            {
              title: 'Disciplinary Records',
              icon: <FaClipboardList className="text-red-700 text-xl" />,
              bg: 'bg-red-100',
              desc: 'View behavior reports',
              onClick: () => alert('page under construction')
            },
            {
              title: 'Exam Results',
              icon: <FaFileAlt className="text-red-700 text-xl" />,
              bg: 'bg-red-100',
              desc: 'View academic performance',
              onClick: () => alert('page under construction')
            },
            {
              title: 'Academic Timetables',
              icon: <FaCalendarAlt className="text-red-700 text-xl" />,
              bg: 'bg-red-100',
              desc: 'View class schedules',
              onClick: () => alert('page under construction')
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={card.onClick}
              className={`bg-white text-gray-800 rounded-3xl shadow-lg p-6 flex items-center cursor-pointer hover:shadow-2xl transition-shadow`}
            >
              <div className={`${card.bg} p-3 rounded-full mr-4`}>
                {card.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{card.title}</h3>
                <p className="text-gray-500 text-sm">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Children List */}
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaChild className="mr-2 text-red-200" />
          My Children
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((s, index) => {
            const dobFormatted = s.dob
              ? new Date(s.dob._seconds * 1000).toLocaleDateString()
              : 'N/A';

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white text-gray-800 rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <FaUserGraduate className="text-red-700 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{s.nameFull}</h3>
                      <p className="text-gray-500">Reg: {s.registrationNo}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start">
                      <FaUser className="text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">{dobFormatted}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaBook className="text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Religion</p>
                        <p className="font-medium capitalize">{s.religion}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaSchool className="text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Previous School</p>
                        <p className="font-medium">{s.previousSchool || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaBook className="text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Subjects</p>
                        <p className="font-medium">
                          {Array.isArray(s.subjects) ? s.subjects.join(', ') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaHeartbeat className="text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Medical Information</p>
                        <p className="font-medium">{s.medical || 'None'}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FaPhone className="text-gray-400 mr-3 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{s.telephone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}