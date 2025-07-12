import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewPaymentStatus() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required.");
          return;
        }

        const authHeader = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(
          `${baseURL}/api/payment-requests/parent`,
          authHeader
        );
        setRequests(res.data || []);
      } catch (err) {
        console.error("Error fetching payment requests:", err);
        setError(
          err.response?.data?.error || "Could not load payment requests."
        );
      }
    };

    fetchRequests();
  }, []);

  const renderStatusBadge = (status) => {
    const base = "inline-block px-3 py-1 rounded-full text-xs font-semibold";
    switch (status) {
      case "approved":
        return <span className={`${base} bg-green-100 text-green-700`}>Approved</span>;
      case "pending":
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
      case "rejected":
        return <span className={`${base} bg-red-100 text-red-700`}>Rejected</span>;
      default:
        return <span className={`${base} bg-gray-200 text-gray-800`}>{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Payment Requests</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600">No payment requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left px-4 py-2">Student</th>
                <th className="text-left px-4 py-2">Course</th>
                <th className="text-left px-4 py-2">Month</th>
                <th className="text-left px-4 py-2">Amount</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Requested On</th>
                <th className="text-left px-4 py-2">Rejection Reason</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{req.studentName || req.studentId}</td>
                  <td className="px-4 py-2">{req.courseName || req.courseId}</td>
                  <td className="px-4 py-2">{req.month}</td>
                  <td className="px-4 py-2">Rs. {req.amountRequested}</td>
                  <td className="px-4 py-2">{renderStatusBadge(req.status)}</td>
                  <td className="px-4 py-2">
                    {req.requestedOn
                      ? new Date(req.requestedOn).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-red-600 italic">
                    {req.status === "rejected" ? req.rejectionReason || "No reason given" : "-"}
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
