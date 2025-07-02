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

export default function ParentDashboard() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/parent-login');

    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/parents/children', {
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 mt-4 text-center">
        <p className="text-gray-600">No child records found.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <FaUserGraduate className="text-3xl" />
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Payment Status */}
          <div 
            onClick={() => navigate('/payment-status')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaMoneyBillWave className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Payment Status</h3>
                <p className="text-gray-500 text-sm">View fee payment history</p>
              </div>
            </div>
          </div>

          {/* Disciplinary Records */}
          <div 
            onClick={() => navigate('/disciplinary-records')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaClipboardList className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Disciplinary Records</h3>
                <p className="text-gray-500 text-sm">View behavior reports</p>
              </div>
            </div>
          </div>

          {/* Exam Results */}
          <div 
            onClick={() => navigate('/exam-results')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FaFileAlt className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Exam Results</h3>
                <p className="text-gray-500 text-sm">View academic performance</p>
              </div>
            </div>
          </div>

          {/* Academic Timetables */}
          <div 
            onClick={() => navigate('/academic-timetables')}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="p-6 flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Academic Timetables</h3>
                <p className="text-gray-500 text-sm">View class schedules</p>
              </div>
            </div>
          </div>
        </div>

        {/* Children List */}
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FaChild className="mr-2 text-blue-600" />
          My Children
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {students.map((s) => {
            const dobFormatted = s.dob
              ? new Date(s.dob._seconds * 1000).toLocaleDateString()
              : 'N/A';

            return (
              <div key={s.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <FaUserGraduate className="text-blue-600 text-xl" />
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
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}