import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaBookOpen,
  FaStream,
  FaUniversity,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function ManageSubjects() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [program, setProgram] = useState("");
  const [stream, setStream] = useState("");
  const [editSubject, setEditSubject] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const streamOptions = ["biology", "maths", "tech", "art", "commerce"];

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/subjects/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubjects(res.data);
      setFilteredSubjects(res.data);
      setError("");
    } catch (err) {
      setError("Failed to load subjects");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let result = [...subjects];
    if (search) {
      result = result.filter((sub) =>
        sub.subjectName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (program) {
      result = result.filter((sub) => sub.program === program);
    }
    if (program === "AL" && stream) {
      result = result.filter((sub) => sub.stream === stream);
    }
    setFilteredSubjects(result);
  }, [search, program, stream, subjects]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`${baseURL}/api/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubjects();
    } catch (err) {
      alert("Failed to delete subject");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editSubject) return;
    try {
      const payload = {
        subjectName: editSubject.subjectName.trim(),
        program: editSubject.program,
      };
      if (editSubject.program === "AL") {
        payload.stream = editSubject.stream;
      }
      await axios.put(`${baseURL}/api/subjects/${editSubject.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditSubject(null);
      fetchSubjects();
    } catch (err) {
      alert("Failed to update subject");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-red-700 rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 bg-opacity-90 min-h-screen text-white p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-6 flex items-center gap-2 text-white"
        >
          <FaBookOpen /> Manage Subjects
        </motion.div>

        {error && <div className="mb-4 text-red-400">{error}</div>}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center border rounded-lg px-3 py-2 bg-white text-gray-800 shadow-sm">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject name"
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 bg-white text-gray-800 shadow-sm">
            <FaUniversity className="text-gray-500 mr-2" />
            <select
              value={program}
              onChange={(e) => {
                setProgram(e.target.value);
                setStream("");
              }}
              className="w-full outline-none"
            >
              <option value="">All Programs</option>
              <option value="OL">OL</option>
              <option value="AL">AL</option>
            </select>
          </div>

          {program === "AL" && (
            <div className="flex items-center border rounded-lg px-3 py-2 bg-white text-gray-800 shadow-sm">
              <FaStream className="text-gray-500 mr-2" />
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="w-full outline-none"
              >
                <option value="">All Streams</option>
                {streamOptions.map((str) => (
                  <option key={str} value={str}>
                    {str.charAt(0).toUpperCase() + str.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white text-gray-800 rounded-3xl shadow-lg p-4 relative"
            >
              <h3 className="text-lg font-semibold text-red-700 mb-1">{subject.subjectName}</h3>
              <p className="text-sm text-gray-600">
                Program: <span className="font-medium">{subject.program}</span>
              </p>
              {subject.program === "AL" && (
                <p className="text-sm text-gray-600">
                  Stream: <span className="capitalize font-medium">{subject.stream}</span>
                </p>
              )}
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => setEditSubject(subject)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(subject.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSubjects.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No subjects found.</p>
        )}

        {/* Edit Modal */}
        {editSubject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
              <h3 className="text-xl font-bold mb-4">Edit Subject</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Subject Name</label>
                  <input
                    type="text"
                    value={editSubject.subjectName}
                    onChange={(e) =>
                      setEditSubject((prev) => ({
                        ...prev,
                        subjectName: e.target.value,
                      }))
                    }
                    required
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Program</label>
                  <select
                    value={editSubject.program}
                    onChange={(e) =>
                      setEditSubject((prev) => ({
                        ...prev,
                        program: e.target.value,
                        stream: "",
                      }))
                    }
                    required
                    className="w-full border px-3 py-2 rounded-lg"
                  >
                    <option value="OL">OL</option>
                    <option value="AL">AL</option>
                  </select>
                </div>

                {editSubject.program === "AL" && (
                  <div>
                    <label className="block font-medium mb-1">Stream</label>
                    <select
                      value={editSubject.stream || ""}
                      onChange={(e) =>
                        setEditSubject((prev) => ({
                          ...prev,
                          stream: e.target.value,
                        }))
                      }
                      required
                      className="w-full border px-3 py-2 rounded-lg"
                    >
                      <option value="">Select Stream</option>
                      {streamOptions.map((str) => (
                        <option key={str} value={str}>
                          {str.charAt(0).toUpperCase() + str.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setEditSubject(null)}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}