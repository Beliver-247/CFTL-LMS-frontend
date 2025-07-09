import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
  FaHourglassHalf,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function PaymentStatusMy() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [payments, setPayments] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/parent-login');

    const fetchPaymentsAndStudents = async () => {
      try {
        // 1. Get children info
        const studentsRes = await axios.get(`${baseURL}/api/parents/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const studentMap = {};
        for (const s of studentsRes.data || []) {
          studentMap[s.id] = s.nameFull || 'Unnamed Student';
        }
        setStudentMap(studentMap);

        // 2. Get payments
        const paymentsRes = await axios.get(`${baseURL}/api/payments/parent/children`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPayments(paymentsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Could not fetch payment data.');
      }
    };

    fetchPaymentsAndStudents();
  }, [navigate]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <FaCheckCircle className="text-green-500 mr-2" />;
      case 'Incomplete':
        return <FaHourglassHalf className="text-yellow-500 mr-2" />;
      case 'Unpaid':
      default:
        return <FaExclamationCircle className="text-red-500 mr-2" />;
    }
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={() => navigate('/parent-dashboard')}
        className="flex items-center text-blue-600 mb-4 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>

      <h1 className="text-2xl font-bold mb-6">Payment Status</h1>

      {payments.length === 0 ? (
        <p className="text-gray-600">No payment records found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center mb-2">
                {renderStatusIcon(p.status)}
                <h3 className="text-lg font-semibold">{p.status}</h3>
              </div>
              <p className="text-gray-600">
                <span className="font-medium">Student:</span>{' '}
                {studentMap[p.studentId] || p.studentId}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Month:</span> {p.month}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Amount Due:</span> Rs. {p.amountDue}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Amount Paid:</span> Rs. {p.amountPaid}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Remaining:</span> Rs. {p.remainingAmount}
              </p>
              {p.paidOn && (
                <p className="text-gray-600">
                  <span className="font-medium">Paid On:</span> {p.paidOn}
                </p>
              )}
              {p.transactionId && (
                <p className="text-gray-600">
                  <span className="font-medium">Transaction ID:</span> {p.transactionId}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
