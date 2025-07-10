import { useEffect, useState } from "react";
import axios from "axios";

export default function EnrolledStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [courseNameFilter, setCourseNameFilter] = useState("All");
  const [courseYearFilter, setCourseYearFilter] = useState("All");
  const [error, setError] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchEnrolledStudents = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/enrollments/coordinator`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load enrolled students");
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enrolled Students</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <select
          value={courseNameFilter}
          onChange={(e) => setCourseNameFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="All">All Course Names</option>
          {uniqueValues("name").map((name) => (
            <option key={name}>{name}</option>
          ))}
        </select>
        <select
          value={courseYearFilter}
          onChange={(e) => setCourseYearFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="All">All Course Years</option>
          {uniqueValues("year").map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No students enrolled in your assigned courses.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow rounded-lg text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Course Name</th>
                <th className="px-4 py-2">Course Year</th>
                <th className="px-4 py-2">Monthly Fee</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{entry.student.nameFull}</td>
                  <td className="px-4 py-2">{entry.student.email}</td>
                  <td className="px-4 py-2">{entry.course?.name || "-"}</td>
                  <td className="px-4 py-2">{entry.course?.year || "-"}</td>
                  <td className="px-4 py-2">Rs. {entry.monthlyFee}</td>
                  <td className="px-4 py-2">
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
    </div>
  );
}
