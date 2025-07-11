import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function PaymentStatusMy() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [payments, setPayments] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [modalData, setModalData] = useState(null);
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/parent-login");

    const fetchPaymentsAndStudents = async () => {
      try {
        const studentsRes = await axios.get(`${baseURL}/api/parents/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const studentMap = {};
        for (const s of studentsRes.data || []) {
          studentMap[s.id] = s.nameFull || "Unnamed Student";
        }
        setStudentMap(studentMap);

        const paymentsRes = await axios.get(
          `${baseURL}/api/payments/parent/children`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const sortedPayments = (paymentsRes.data || []).sort(
          (a, b) => new Date(a.month) - new Date(b.month)
        );
        setPayments(sortedPayments);
      } catch (err) {
        setError(err.response?.data?.error || "Could not fetch payment data.");
      }
    };

    fetchPaymentsAndStudents();
  }, [navigate]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case "Paid":
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case "Incomplete":
        return <FaHourglassHalf className="text-yellow-500 mr-2" />;
      case "Unpaid":
      default:
        return <FaExclamationCircle className="text-red-500 mr-2" />;
    }
  };

  const handleSubmit = async () => {
    if (!modalData || !file || !amount) {
      setError("All fields are required.");
      return;
    }

    if (Number(amount) > modalData.remainingAmount) {
      setError("Amount cannot exceed remaining balance.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      // 1. Request signed URL
      const uploadRes = await axios.post(
        `${baseURL}/api/uploads/signed-url`,
        {
          fileName: file.name,
          fileType: file.type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { uploadUrl, receiptUrl } = uploadRes.data;

      // 2. Upload file to GCS
      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      // 3. Send payment request
      await axios.post(
        `${baseURL}/api/payment-requests`,
        {
          paymentId: modalData.id,
          studentId: modalData.studentId,
          courseId: modalData.courseId,
          month: modalData.month,
          amountRequested: Number(amount),
          remainingAmount: modalData.remainingAmount,
          receiptUrl,
          paymentDate: modalData.month,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Payment request submitted successfully!");
      setModalData(null);
      setAmount("");
      setFile(null);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (payment) => {
    setModalData(payment);
    setAmount("");
    setFile(null);
    setError("");
    setSuccess("");
  };

  const closeModal = () => {
    setModalData(null);
    setAmount("");
    setFile(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate("/parent-dashboard")}
        className="flex items-center text-blue-600 mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
          {success}
        </div>
      )}

      {payments.length === 0 ? (
        <p className="text-gray-600">No payment records found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow relative"
            >
              <div className="flex items-center mb-2">
                {renderStatusIcon(p.status)}
                <h3 className="text-lg font-semibold">{p.status}</h3>
              </div>
              <p>
                <strong>Student:</strong> {studentMap[p.studentId]}
              </p>
              <p>
                <strong>Course:</strong> {p.courseName}
              </p>
              <p>
                <strong>Month:</strong> {p.month}
              </p>
              <p>
                <strong>Amount Due:</strong> Rs. {p.amountDue}
              </p>
              <p>
                <strong>Amount Paid:</strong> Rs. {p.amountPaid}
              </p>
              <p>
                <strong>Remaining:</strong> Rs. {p.remainingAmount}
              </p>
              {p.paidOn && (
                <p>
                  <strong>Paid On:</strong> {p.paidOn}
                </p>
              )}
              {p.transactionId && (
                <p>
                  <strong>Transaction ID:</strong> {p.transactionId}
                </p>
              )}

              {(p.status === "Unpaid" || p.status === "Incomplete") && (
                <button
                  onClick={() => openModal(p)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Mark as Paid</h2>
            <p>
              <strong>Student:</strong> {studentMap[modalData.studentId]}
            </p>
            <p>
              <strong>Month:</strong> {modalData.month}
            </p>
            <p>
              <strong>Remaining:</strong> Rs. {modalData.remainingAmount}
            </p>
            <p>
              <strong>Payment Due Date:</strong> {modalData.month}
            </p>
            <p>
              <strong>Current Date:</strong> {new Date().toLocaleDateString()}
            </p>

            <div className="mt-4">
              <label className="block font-medium">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
            </div>

            <div className="mt-4">
              <label className="block font-medium">
                Receipt Upload (.jpg, .png, .pdf)
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
