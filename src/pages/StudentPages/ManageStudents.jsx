import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTrash, FaEdit, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getFreshToken } from "../../utils/authToken";

export default function ManageStudents() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [religionFilter, setReligionFilter] = useState("All");
  const [courseNameFilter, setCourseNameFilter] = useState("All");
  const [courseYearFilter, setCourseYearFilter] = useState("All");
  const [courseDurationFilter, setCourseDurationFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEnrollments = async () => {
    try {
      const token = await getFreshToken();
      const res = await axios.get(`${baseURL}/api/enrollments/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Failed to fetch enrollments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const uniqueValues = (key) =>
    [...new Set(enrollments.map((e) => e.course?.[key]).filter(Boolean))];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = await getFreshToken();
      await axios.delete(`${baseURL}/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments((prev) => prev.filter((e) => e.student.id !== id));
      setFiltered((prev) => prev.filter((e) => e.student.id !== id));
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

const filterAll = () => {
  let result = enrollments;

  if (religionFilter !== "All") {
    result = result.filter(
      (e) =>
        e.student.religion?.toLowerCase() === religionFilter.toLowerCase()
    );
  }

  if (courseNameFilter !== "All") {
    result = result.filter((e) => e.course?.name === courseNameFilter);
  }

  if (courseYearFilter !== "All") {
    result = result.filter((e) => e.course?.year === courseYearFilter);
  }

  if (courseDurationFilter !== "All") {
    result = result.filter((e) => e.course?.duration === courseDurationFilter);
  }

  if (searchTerm) {
    const search = searchTerm.toLowerCase();
    result = result.filter(
      (e) =>
        e.student.nameFull?.toLowerCase().includes(search) ||
        e.student.registrationNo?.toLowerCase().includes(search) ||
        e.student.nic?.toLowerCase().includes(search)
    );
  }

  setFiltered(result);
};


  useEffect(() => {
    filterAll();
  }, [searchTerm, religionFilter, courseNameFilter, courseYearFilter, courseDurationFilter, enrollments]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-800 flex items-center space-x-2">
        <FaUser /> <span>Manage Students</span>
      </h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name, Reg No, or NIC"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded w-full"
        />
        <select
          value={religionFilter}
          onChange={(e) => setReligionFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="All">All Religions</option>
          <option value="Buddhism">Buddhism</option>
          <option value="Catholicism">Catholicism</option>
          <option value="Islam">Islam</option>
          <option value="Hindu">Hindu</option>
        </select>
        <select
          value={courseNameFilter}
          onChange={(e) => setCourseNameFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="All">All Course Names</option>
          {uniqueValues("name").map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <select
          value={courseYearFilter}
          onChange={(e) => setCourseYearFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="All">All Years</option>
          {uniqueValues("year").map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
        <select
          value={courseDurationFilter}
          onChange={(e) => setCourseDurationFilter(e.target.value)}
          className="px-4 py-2 border rounded"
        >
          <option value="All">All Durations</option>
          {uniqueValues("duration").map((dur) => (
            <option key={dur}>{dur}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center mt-10">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading students...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">No students found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-blue-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-2">Reg No</th>
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">NIC</th>
                <th className="px-4 py-2">Telephone</th>
                <th className="px-4 py-2">Religion</th>
                <th className="px-4 py-2">Course</th>
                <th className="px-4 py-2">Year</th>
                <th className="px-4 py-2">Duration</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(({ student, course }) => (
                <tr key={student.id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2">{student.registrationNo}</td>
                  <td
                    className="px-4 py-2 text-blue-600 underline cursor-pointer"
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                  >
                    {student.nameFull}
                  </td>
                  <td className="px-4 py-2">{student.nic || "-"}</td>
                  <td className="px-4 py-2">{student.telephone}</td>
                  <td className="px-4 py-2">{student.religion}</td>
                  <td className="px-4 py-2">{course?.name || "-"}</td>
                  <td className="px-4 py-2">{course?.year || "-"}</td>
                  <td className="px-4 py-2">{course?.duration || "-"}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
