import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function EnrolledStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [courseNameFilter, setCourseNameFilter] = useState("All");
  const [courseYearFilter, setCourseYearFilter] = useState("All");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${baseURL}/api/enrollments/coordinator`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
        setFiltered(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load enrolled students");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledStudents();
  }, []);

  const uniqueValues = (key) => [
    ...new Set(students.map((e) => e.course?.[key]).filter(Boolean)),
  ];

  const filterData = () => {
    let data = [...students];

    if (courseNameFilter !== "All") {
      data = data.filter((e) => e.course?.name === courseNameFilter);
    }

    if (courseYearFilter !== "All") {
      data = data.filter((e) => e.course?.year === courseYearFilter);
    }

    setFiltered(data);
  };

  useEffect(() => {
    filterData();
  }, [courseNameFilter, courseYearFilter, students]);

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      await axios.patch(
        `${baseURL}/api/enrollments/${enrollmentId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStudents((prev) =>
        prev.map((e) =>
          e.id === enrollmentId ? { ...e, status: newStatus } : e
        )
      );
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to update status.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-white rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">
            Enrolled Students
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-6">
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <select
              value={courseNameFilter}
              onChange={(e) => setCourseNameFilter(e.target.value)}
              className="px-4 py-2 rounded text-gray-900"
            >
              <option value="All">All Course Names</option>
              {uniqueValues("name").map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>

            <select
              value={courseYearFilter}
              onChange={(e) => setCourseYearFilter(e.target.value)}
              className="px-4 py-2 rounded text-gray-900"
            >
              <option value="All">All Course Years</option>
              {uniqueValues("year").map((year) => (
                <option key={year}>{year}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="text-gray-300">No students enrolled in your assigned courses.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto bg-white rounded-xl shadow text-sm text-gray-800">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Course</th>
                    <th className="px-4 py-3 text-left">Year</th>
                    <th className="px-4 py-3 text-left">Monthly Fee</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">{entry.student.nameFull}</td>
                      <td className="px-4 py-3">{entry.student.email}</td>
                      <td className="px-4 py-3">{entry.course?.name || "-"}</td>
                      <td className="px-4 py-3">{entry.course?.year || "-"}</td>
                      <td className="px-4 py-3">Rs. {entry.monthlyFee}</td>
                      <td className="px-4 py-3">
                        <select
                          className="border px-2 py-1 rounded"
                          value={entry.status}
                          onChange={(e) =>
                            handleStatusChange(entry.id, e.target.value)
                          }
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
