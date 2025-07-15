import { useEffect, useState } from "react";
import axios from "axios";
import { getFreshToken } from "../../utils/authToken";

export default function AdminPaymentRequests() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = await getFreshToken();
        const res = await axios.get(`${baseURL}/api/payment-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRequests(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load payment requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [baseURL]);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-red-800">All Payment Requests</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-600">No payment requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-red-700 text-white text-left text-sm">
                <th className="p-3">Student</th>
                <th className="p-3">Course</th>
                <th className="p-3">Month</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Requested On</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3">{req.studentName || 'N/A'}</td>
                  <td className="p-3">{req.courseName || 'N/A'}</td>
                  <td className="p-3">{req.month}</td>
                  <td className="p-3">Rs. {req.amountRequested}</td>
                  <td className="p-3 capitalize text-sm font-semibold text-gray-700">{req.status}</td>
                  <td className="p-3 text-xs text-gray-500">
                    {req.requestedOn ? new Date(req.requestedOn).toLocaleDateString() : 'N/A'}
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
