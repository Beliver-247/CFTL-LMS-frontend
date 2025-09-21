// pages/CoordinatorPages/CoordinatorCourseSubjects.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AL_STREAMS = ["biology", "maths", "tech", "art", "commerce"];

export default function CoordinatorCourseSubjects() {
  const { courseId } = useParams();
  const { state } = useLocation(); // { program, stream } (optional)
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const [courseName, setCourseName] = useState("");
  const [program, setProgram] = useState((state?.program || "").toUpperCase());
  const [stream, setStream] = useState((state?.stream || "").toLowerCase());
  const [subjects, setSubjects] = useState([]);
  const [error, setError] = useState("");
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const navigate = useNavigate();

  // If program/stream not provided, fetch the course and derive them
  useEffect(() => {
    if (program) return; // already have program from state
    (async () => {
      try {
        setLoadingCourse(true);
        const res = await axios.get(`${baseURL}/api/courses/${courseId}`, { headers });
        const c = res.data || {};
        setCourseName(c.name || "");
        setProgram((c.program || "OL").toUpperCase());
        setStream((c.stream || "").toLowerCase());
      } catch {
        setError("Failed to load course details.");
      } finally {
        setLoadingCourse(false);
      }
    })();
  }, [program, courseId, baseURL, headers]);

  // Fetch subjects for this course (by program/stream)
  useEffect(() => {
    const load = async () => {
      if (!program) return; // need program to proceed
      if (program === "AL" && !AL_STREAMS.includes(stream)) return; // wait for a valid stream selection
      try {
        setLoadingSubjects(true);
        const qs =
          program === "AL"
            ? `?program=AL&stream=${encodeURIComponent(stream)}`
            : `?program=OL`;

        const res = await axios.get(`${baseURL}/api/subjects${qs}`, { headers });
        setSubjects(Array.isArray(res.data) ? res.data : []);
        setError("");
      } catch (err) {
        setSubjects([]);
        setError(err?.response?.data?.error || "Failed to fetch subjects for this course.");
      } finally {
        setLoadingSubjects(false);
      }
    };
    load();
  }, [program, stream, baseURL, headers]);

  const needStreamPicker = program === "AL" && !AL_STREAMS.includes(stream);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {courseName ? `Subjects in ${courseName}` : "Select a Subject"}
        </h1>

        {(loadingCourse || loadingSubjects) && (
          <p className="mb-4">Loading…</p>
        )}

        {error && (
          <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stream selector only when AL program and stream missing/invalid */}
        {needStreamPicker && (
          <div className="bg-white text-gray-800 rounded-xl shadow p-4 mb-6">
            <label className="block font-semibold mb-2">Select Stream (AL):</label>
            <select
              className="border rounded px-3 py-2"
              value={stream || ""}
              onChange={(e) => setStream(e.target.value)}
            >
              <option value="" disabled>Choose a stream</option>
              {AL_STREAMS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((s) => (
            <div
              key={s.id}
              onClick={() => navigate(`/coordinator/subjects/${s.id}/approve-syllabus`)}
              className="bg-white text-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {s.subjectName || s.name || "Untitled Subject"}
              </h2>
              {s.program && <p className="text-sm text-gray-700">Program: {s.program}</p>}
              {s.stream && <p className="text-sm text-gray-700">Stream: {s.stream}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
