import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getFreshToken } from "../../utils/authToken";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/students/${id}`);
        setStudent(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load student.");
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e, parentKey) => {
    const { name, value } = e.target;

    if (parentKey) {
      setStudent((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev[parentKey],
          [name]: value,
        },
      }));
    } else {
      setStudent((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    try {
      const token = await getFreshToken();
      await axios.put(`${baseURL}/api/students/${id}`, student, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Student updated successfully!");
    } catch (err) {
      setError("Failed to update student.");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Edit Student</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="nameFull"
              value={student.nameFull || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
            <input
              type="text"
              name="nic"
              value={student.nic || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
            <select
              name="religion"
              value={student.religion}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Buddhism">Buddhism</option>
              <option value="Catholicism">Catholicism</option>
              <option value="Islam">Islam</option>
              <option value="Hindu">Hindu</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
            <input
              type="text"
              name="telephone"
              value={student.telephone || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Optional: Edit Parents Info */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Mother's Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Mother's Name"
              value={student.mother?.name || ""}
              onChange={(e) => handleChange(e, "mother")}
              className="w-full border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="nic"
              placeholder="Mother's NIC"
              value={student.mother?.nic || ""}
              onChange={(e) => handleChange(e, "mother")}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/manage-students")}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Update Student
          </button>
        </div>
      </form>
    </div>
  );
}
