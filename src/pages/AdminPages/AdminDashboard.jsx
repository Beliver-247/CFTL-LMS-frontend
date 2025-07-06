import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase"; // Adjust the import path as necessary
import {
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaEdit,
  FaTrash,
  FaUsers,
  FaChalkboardTeacher,
  FaBookOpen,
} from "react-icons/fa";

export default function AdminDashboard() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        navigate("/admin-login");
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/api/admins/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          navigate("/admin-complete-profile");
        } else {
          setError("Failed to fetch admin profile");
        }
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your profile?"
    );
    if (!confirm) return;

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`${baseURL}/api/admins/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("adminToken");
      navigate("/admin-login");
    } catch (err) {
      alert("Failed to delete profile.");
    }
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  if (!admin)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center space-x-2">
            <FaUser className="text-3xl" />
            <span>Admin Dashboard</span>
          </h1>
          <button
onClick={async () => {
  await auth.signOut();
  localStorage.removeItem("adminToken");
  window.location.href = "/admin-login";
}}

            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6 flex flex-col md:flex-row items-center">
          <img
            src={admin.profilePictureUrl || "/default-profile.png"}
            alt="Admin"
            className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">{admin.fullName}</h2>
            <p className="text-gray-600 flex items-center">
              <FaEnvelope className="mr-2" /> {admin.email}
            </p>
          </div>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={() => navigate("/admin-complete-profile")}
              className="flex items-center space-x-1 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Dashboard Actions */}
        {/* Dashboard Actions */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Manage Students */}
  <div
    onClick={() => alert("Manage Students")}
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 flex items-center"
  >
    <div className="bg-blue-100 p-3 rounded-full mr-4">
      <FaUsers className="text-blue-600 text-xl" />
    </div>
    <div>
      <h3 className="font-semibold text-lg">Manage Students</h3>
      <p className="text-gray-500 text-sm">Add, update or remove students</p>
    </div>
  </div>

  {/* Manage Teachers */}
  <div
    onClick={() => alert("Manage Teachers")}
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 flex items-center"
  >
    <div className="bg-green-100 p-3 rounded-full mr-4">
      <FaChalkboardTeacher className="text-green-600 text-xl" />
    </div>
    <div>
      <h3 className="font-semibold text-lg">Manage Teachers</h3>
      <p className="text-gray-500 text-sm">Assign subjects or edit teacher info</p>
    </div>
  </div>

  {/* Manage Syllabus */}
  <div
    onClick={() => alert("Manage Syllabus")}
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 flex items-center"
  >
    <div className="bg-purple-100 p-3 rounded-full mr-4">
      <FaBookOpen className="text-purple-600 text-xl" />
    </div>
    <div>
      <h3 className="font-semibold text-lg">Manage Syllabus</h3>
      <p className="text-gray-500 text-sm">Edit curriculum and course content</p>
    </div>
  </div>

  {/* Manage Courses */}
  <div
    onClick={() => navigate("/admin/manage-courses")}
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 flex items-center"
  >
    <div className="bg-indigo-100 p-3 rounded-full mr-4">
      <FaBookOpen className="text-indigo-600 text-xl" />
    </div>
    <div>
      <h3 className="font-semibold text-lg">Manage Courses</h3>
      <p className="text-gray-500 text-sm">Create, edit, or delete courses</p>
    </div>
  </div>

  {/* ✅ Manage Subjects */}
  <div
    onClick={() => navigate("/admin/manage-subjects")}
    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 flex items-center"
  >
    <div className="bg-orange-100 p-3 rounded-full mr-4">
      <FaBookOpen className="text-orange-600 text-xl" />
    </div>
    <div>
      <h3 className="font-semibold text-lg">Manage Subjects</h3>
      <p className="text-gray-500 text-sm">Add, edit, or remove subjects</p>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}
