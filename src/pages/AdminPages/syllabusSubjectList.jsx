import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaBookOpen, FaChalkboardTeacher } from "react-icons/fa";

const STREAMS = ["biology", "maths", "tech", "art", "commerce"];

export default function SyllabusSubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [program, setProgram] = useState("OL"); // default to OL
  const [stream, setStream] = useState(STREAMS[0]); // relevant only for AL
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const params =
        program === "AL"
          ? `?program=AL&stream=${encodeURIComponent(stream)}`
          : `?program=OL`;

      const res = await axios.get(`${baseURL}/api/subjects${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubjects(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setSubjects([]);
      setError(
        err?.response?.data?.error || "Failed to fetch subjects. Check program/stream."
      );
    }
  };

  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program, stream]);

  const handleSubjectClick = (id) => {
    navigate(`/admin/subjects/${id}/syllabus`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Select a Subject</h1>
          <div className="flex gap-3">
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="text-gray-900 rounded px-3 py-2"
            >
              <option value="OL">OL</option>
              <option value="AL">AL</option>
            </select>
            {program === "AL" && (
              <select
                value={stream}
                onChange={(e) => setStream(e.target.value)}
                className="text-gray-900 rounded px-3 py-2"
              >
                {STREAMS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, idx) => (
            <motion.div
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white text-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {subject.subjectName || subject.name || "Untitled Subject"}
              </h2>
              {subject.program && (
                <p className="text-sm text-gray-700 mb-1">Program: {subject.program}</p>
              )}
              {subject.stream && (
                <p className="text-sm text-gray-700 mb-1">Stream: {subject.stream}</p>
              )}
              {Array.isArray(subject.teacherIds) && (
                <p className="text-sm text-gray-700 flex items-center mt-1">
                  <FaChalkboardTeacher className="mr-1" /> Teachers: {subject.teacherIds.length}
                </p>
              )}
              {subject.description && (
                <p className="text-sm text-gray-700 flex items-center mt-1">
                  <FaBookOpen className="mr-1" /> {subject.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
