import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTrash, FaEdit, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getFreshToken } from "../../utils/authToken";

export default function ManageStudents() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [religionFilter, setReligionFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/students`);
      setStudents(res.data);
      setFiltered(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const token = await getFreshToken();
      await axios.delete(`${baseURL}/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setFiltered((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete student.");
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearchTerm(val);
    filterStudents(val, religionFilter);
  };

  const handleReligionChange = (e) => {
    const val = e.target.value;
    setReligionFilter(val);
    filterStudents(searchTerm, val);
  };

  const filterStudents = (search, religion) => {
    let filtered = students;

    if (religion !== "All") {
      filtered = filtered.filter(
        (s) => s.religion && s.religion.toLowerCase() === religion.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter(
        (s) =>
          s.nameFull?.toLowerCase().includes(search) ||
          s.registrationNo?.toLowerCase().includes(search) ||
          s.nic?.toLowerCase().includes(search)
      );
    }

    setFiltered(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-800 flex items-center space-x-2">
        <FaUser /> <span>Manage Students</span>
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search by Name, Reg No, or NIC"
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 outline-none w-full sm:w-64"
          />
          <div className="bg-blue-500 text-white p-2">
            <FaSearch />
          </div>
        </div>

        <div>
          <select
            value={religionFilter}
            onChange={handleReligionChange}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="All">All Religions</option>
            <option value="Buddhism">Buddhism</option>
            <option value="Catholicism">Catholicism</option>
            <option value="Islam">Islam</option>
            <option value="Hindu">Hindu</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
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
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-t hover:bg-gray-50 text-sm">
                  <td className="px-4 py-2">{student.registrationNo}</td>
                  <td className="px-4 py-2">{student.nameFull}</td>
                  <td className="px-4 py-2">{student.nic || "-"}</td>
                  <td className="px-4 py-2">{student.telephone}</td>
                  <td className="px-4 py-2">{student.religion}</td>
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
