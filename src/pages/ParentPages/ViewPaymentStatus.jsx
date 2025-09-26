import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ViewPaymentStatus() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required.");
          setPageLoading(false);
          return;
        }

        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        const res = await axios.get(`${baseURL}/api/payment-requests/parent`, authHeader);
        const data = res.data || [];

        // Keep behavior but sort newest first for better UX
        data.sort((a, b) => new Date(b.requestedOn || 0) - new Date(a.requestedOn || 0));

        setRequests(data);
      } catch (err) {
        setError(err.response?.data?.error || "Could not load payment requests.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchRequests();
  }, [baseURL]);

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-950/70 backdrop-blur border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/parent-dashboard")}
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300"
          >
            <FaArrowLeft /> Back to Dashboard
          </button>
          <h1 className="text-xl font-semibold">My Payment Requests</h1>
          <div />
        </div>
      </header>

      {/* Page loading */}
      {pageLoading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700" />
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>
          )}

          {requests.length === 0 ? (
            <p className="text-gray-300">No payment requests found.</p>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white text-gray-900 rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-sm text-gray-600">
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Month</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Requested On</th>
                      <th className="px-4 py-3">Rejection Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req, idx) => (
                      <tr
                        key={req.id}
                        className="border-t hover:bg-gray-50/80 transition-colors"
                      >
                        <td className="px-4 py-3">{req.studentName || req.studentId}</td>
                        <td className="px-4 py-3">{req.courseName || req.courseId}</td>
                        <td className="px-4 py-3">{req.month}</td>
                        <td className="px-4 py-3">Rs. {req.amountRequested}</td>
                        <td className="px-4 py-3">{renderStatusBadge(req.status)}</td>
                        <td className="px-4 py-3">
                          {req.requestedOn ? new Date(req.requestedOn).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600 italic">
                          {req.status === "rejected" ? req.rejectionReason || "No reason given" : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </main>
      )}
    </div>
  );
}