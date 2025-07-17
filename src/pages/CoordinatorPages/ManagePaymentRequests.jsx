import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function ManagePaymentRequests() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `${baseURL}/api/payment-requests/coordinator`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data || []);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to fetch payment requests."
      );
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${baseURL}/api/payment-requests/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Payment request approved successfully!");
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || "Approval failed.");
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async () => {
    if (!rejectionReason.trim()) {
      setError("Rejection reason is required.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${baseURL}/api/payment-requests/${rejectingId}/reject`,
        { rejectionReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess("Payment request rejected successfully!");
      closeModal();
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || "Rejection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (receiptUrl) => {
    try {
      const token = localStorage.getItem("adminToken");
      const filePath = decodeURIComponent(
        new URL(receiptUrl).pathname.split("/o/")[1].split("?")[0]
      );
      const res = await axios.post(
        `${baseURL}/api/uploads/view-url`,
        { filePath },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.open(res.data.signedUrl, "_blank");
    } catch (err) {
      console.error(err);
      setError("Could not generate secure receipt link.");
    }
  };

  const openRejectModal = (id) => {
    setRejectingId(id);
    setRejectionReason("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setRejectingId(null);
    setRejectionReason("");
    setError("");
  };

  const renderStatus = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500 mr-1" />;
      case "pending":
        return <FaClock className="text-yellow-500 mr-1" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6 text-center">
            Manage Payment Requests
          </h1>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
              {success}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin h-10 w-10 border-t-4 border-b-4 border-white rounded-full" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-gray-300 text-center">
              No payment requests available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white text-gray-800 rounded-2xl shadow-xl p-6 relative"
                >
                  <div className="flex items-center mb-2">
                    {renderStatus(req.status)}
                    <h2 className="text-lg font-semibold ml-2 uppercase">
                      {req.status}
                    </h2>
                  </div>
                  <p>
                    <strong>Student:</strong> {req.studentName}
                  </p>
                  <p>
                    <strong>Course:</strong> {req.courseName}
                  </p>
                  <p>
                    <strong>Month:</strong> {req.month}
                  </p>
                  <p>
                    <strong>Amount:</strong> Rs. {req.amountRequested}
                  </p>
                  <p>
                    <strong>Requested On:</strong>{" "}
                    {new Date(req.requestedOn?.seconds * 1000).toLocaleDateString()}
                  </p>

                  {req.status === "approved" && (
                    <p>
                      <strong>Approved By:</strong> {req.approvedBy}
                    </p>
                  )}
                  {req.status === "rejected" && (
                    <p className="text-red-600 italic mt-1">
                      <strong>Reason:</strong> {req.rejectionReason || "Not provided"}
                    </p>
                  )}

                  <button
                    onClick={() => handleViewReceipt(req.receiptUrl)}
                    className="text-blue-600 hover:underline mt-2 flex items-center"
                  >
                    <FaEye className="mr-1" /> View Receipt
                  </button>

                  {req.status === "pending" && (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => approveRequest(req.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(req.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-gray-800 p-6 rounded-xl w-full max-w-md relative shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">Reject Payment Request</h2>
            <label className="block font-medium mb-1">Reason for Rejection</label>
            <textarea
              className="w-full border border-gray-300 rounded p-2"
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter reason..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                onClick={rejectRequest}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Rejecting..." : "Submit Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
