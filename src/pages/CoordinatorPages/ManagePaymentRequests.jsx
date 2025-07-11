// pages/CoordinatorPages/ManagePaymentRequests.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

export default function ManagePaymentRequests() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${baseURL}/api/payment-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch payment requests.");
    } finally {
      setLoading(false);
    }
  };

  const approveRequest = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      await axios.put(`${baseURL}/api/payment-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Payment request approved successfully!');
      fetchRequests(); // refresh
    } catch (err) {
      setError(err.response?.data?.error || "Approval failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (receiptUrl) => {
    try {
      const token = localStorage.getItem('adminToken');
      const filePath = decodeURIComponent(new URL(receiptUrl).pathname.split("/o/")[1].split("?")[0]);

      const res = await axios.post(
        `${baseURL}/api/uploads/view-url`,
        { filePath },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      window.open(res.data.signedUrl, '_blank');
    } catch (err) {
      console.error(err);
      setError("Could not generate secure receipt link.");
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="text-green-600 mr-1" />;
      case 'pending':
        return <FaClock className="text-yellow-600 mr-1" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-600 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Manage Payment Requests</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-600">No payment requests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-white rounded-lg shadow-md p-5 relative">
              <div className="flex items-center mb-2">
                {renderStatus(req.status)}
                <h2 className="text-lg font-semibold">{req.status.toUpperCase()}</h2>
              </div>
              <p><strong>Student ID:</strong> {req.studentId}</p>
              <p><strong>Course ID:</strong> {req.courseId}</p>
              <p><strong>Month:</strong> {req.month}</p>
              <p><strong>Amount:</strong> Rs. {req.amountRequested}</p>
              <p><strong>Requested On:</strong> {new Date(req.requestedOn?.seconds * 1000).toLocaleDateString()}</p>
              {req.status === 'approved' && (
                <p><strong>Approved By:</strong> {req.approvedBy}</p>
              )}

              <button
                onClick={() => handleViewReceipt(req.receiptUrl)}
                className="text-blue-600 hover:underline block mt-2"
              >
                View Receipt
              </button>

              {req.status === 'pending' && (
                <button
                  onClick={() => approveRequest(req.id)}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Approve Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
