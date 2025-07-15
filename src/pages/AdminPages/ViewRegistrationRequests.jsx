import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewRegistrationRequests() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${baseURL}/api/registration-requests`)
      .then(res => {
        setRequests(res.data);
      })
      .catch(() => setError("Failed to load registration requests."))
      .finally(() => setLoading(false));
  }, [baseURL]);

  const getCategoryKey = (program, duration) =>
    `${program}_${duration.replace(" ", "")}`;

  const filtered = filter === "All"
    ? requests
    : requests.filter(r =>
        getCategoryKey(r.program, r.duration) === filter
      );

  const categories = ["All", "OL_6month", "OL_1year", "AL_6month", "AL_1year"];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-red-800 mb-6">
        Registration Requests
      </h1>

      <div className="mb-4">
        <label className="mr-2 font-medium">Filter by Course Category:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat.replace("_", " - ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : filtered.length === 0 ? (
        <div>No matching requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Program</th>
                <th className="border px-4 py-2">Stream</th>
                <th className="border px-4 py-2">Year</th>
                <th className="border px-4 py-2">Duration</th>
                <th className="border px-4 py-2">Starting Month</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{r.name}</td>
                  <td className="border px-4 py-2">{r.email}</td>
                  <td className="border px-4 py-2">{r.phone}</td>
                  <td className="border px-4 py-2">{r.program}</td>
                  <td className="border px-4 py-2">{r.stream || "-"}</td>
                  <td className="border px-4 py-2">{r.year}</td>
                  <td className="border px-4 py-2">{r.duration}</td>
                  <td className="border px-4 py-2">{r.startingMonth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
