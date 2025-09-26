import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { motion } from "framer-motion";
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
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [modalData, setModalData] = useState(null);
  const [file, setFile] = useState(null);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [blockedReason, setBlockedReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/parent-login");

    const fetchPaymentsAndRequests = async () => {
      setPageLoading(true);
      try {
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };

        const [studentsRes, paymentsRes, requestsRes] = await Promise.all([
          axios.get(`${baseURL}/api/parents/children`, authHeader),
          axios.get(`${baseURL}/api/payments/parent/children`, authHeader),
          axios.get(`${baseURL}/api/payment-requests/parent`, authHeader),
        ]);

        const _studentMap = {};
        for (const s of studentsRes.data || []) {
          _studentMap[s.id] = s.nameFull || "Unnamed Student";
        }
        setStudentMap(_studentMap);

        const sortedPayments = (paymentsRes.data || []).sort(
          (a, b) => new Date(a.month) - new Date(b.month)
        );
        setPayments(sortedPayments);
        setPaymentRequests(requestsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || "Could not fetch payment data.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchPaymentsAndRequests();
  }, [navigate, baseURL]);

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

  const openModal = (payment) => {
    const requestsForPayment = paymentRequests.filter(
      (r) => r.paymentId === payment.id
    );

    const hasPending = requestsForPayment.some((r) => r.status === "pending");
    const maxReached = requestsForPayment.length >= 3;

    if (hasPending) {
      setBlockedReason("You already have a pending request for this payment.");
    } else if (maxReached) {
      setBlockedReason("You have reached the maximum of 3 requests for this payment.");
    } else {
      setBlockedReason("");
    }

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
    setBlockedReason("");
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
      setSubmitting(true);
      setError("");
      const token = localStorage.getItem("token");

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

      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

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
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to submit request.");
    } finally {
      setSubmitting(false);
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
          <h1 className="text-xl font-semibold">Payment Status</h1>
          <div />
        </div>
      </header>

      {/* Page loading state */}
      {pageLoading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700" />
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {payments.length === 0 ? (
            <p className="text-gray-300">No payment records found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payments.map((p, idx) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.2) }}
                  className="bg-white text-gray-900 rounded-3xl shadow-xl p-6 hover:shadow-2xl transition-shadow relative"
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
                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        onClick={() => openModal(p)}
                        className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
                      >
                        Mark as Paid
                      </button>
                      <button
                        onClick={() => openModal(p)}
                        title="Make another payment"
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-black"
                      >
                        +
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6"
          >
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

            {blockedReason ? (
              <div className="text-red-600 font-semibold mt-4">{blockedReason}</div>
            ) : (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium">
                    Receipt Upload (.jpg, .png, .pdf)
                  </label>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={() => {
                  if (submitting) return;
                  setModalData(null);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800 disabled:opacity-60"
                disabled={submitting || !!blockedReason}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}