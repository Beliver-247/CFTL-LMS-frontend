import { useEffect, useState } from "react";
import axios from "axios";
import { FaTimes, FaSave } from "react-icons/fa";

export default function StudentPaymentsModal({
  isOpen,
  onClose,
  studentId,
  courseId,
}) {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [payments, setPayments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const formatRs = (num) =>
  `Rs. ${Number(num).toLocaleString("en-LK", { minimumFractionDigits: 0 })}`;


  useEffect(() => {
    if (!isOpen || !studentId) return;

    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/payments/student/${studentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const filtered = res.data
          .filter((p) => p.courseId === courseId)
          .sort((a, b) => a.month.localeCompare(b.month));

        setPayments(filtered);
        setError("");
      } catch (err) {
        setError("Failed to load payment data");
      }
    };

    fetchPayments();
  }, [isOpen, studentId, courseId]);

  const handleChange = (id, field, value) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.all(
        payments.map((p) => {
          const amountPaid = Number(p.amountPaid) || 0;
          const originalDue = Number(p.amountDue) || 0;

          return axios.put(
            `${baseURL}/api/payments/${p.id}`,
            {
              amountPaid,
              status: p.status,
              paidOn: p.paidOn,
              transactionId: p.transactionId,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        })
      );
      onClose();
    } catch (err) {
      alert("Failed to save some payments.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const formatMonthName = (monthStr) => {
    const [year, month] = monthStr.split("-").map(Number);
    const date = new Date(year, month - 1); // JS months are 0-based
    return date.toLocaleString("default", { month: "short" }); // e.g., Jan, Feb
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {payments.length === 0 ? (
          <p>No payment records found.</p>
        ) : (
          <div className="overflow-x-auto">
            {payments.length > 0 && (
              <p className="text-gray-700 mb-4">
                Monthly Fee:{" "}
                <span className="font-semibold text-indigo-600">
                  Rs. {payments[0].amountDue}
                </span>
              </p>
            )}

            <table className="w-full table-auto text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Month</th>
                  <th className="p-2 border">Amount Due</th>
                  <th className="p-2 border">Amount Paid</th>
                  <th className="p-2 border">Remaining</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Paid On</th>
                  <th className="p-2 border">Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                 <tr key={p.id} className="border-t">
  <td className="p-2 border">
    {p.month} ({formatMonthName(p.month)})
  </td>

  <td className="p-2 border">{formatRs(p.amountDue)}</td>

  <td className="p-2 border">
    <input
      type="number"
      value={p.amountPaid}
      step={1000}
      onChange={(e) =>
        handleChange(p.id, "amountPaid", e.target.value)
      }
      className="border px-2 py-1 w-24 rounded"
    />
  </td>

<td className="p-2 border">{formatRs(p.remainingAmount)}</td>


  <td className="p-2 border">
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        p.amountPaid >= p.amountDue
          ? "bg-green-100 text-green-800"
          : p.amountPaid > 0
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-700"
      }`}
    >
      {p.amountPaid >= p.amountDue
        ? "Paid"
        : p.amountPaid > 0
        ? "Incomplete"
        : "Unpaid"}
    </span>
  </td>

  <td>
    <input
      type="date"
      value={p.paidOn || ""}
      onChange={(e) =>
        handleChange(p.id, "paidOn", e.target.value)
      }
      className="border px-2 py-1 rounded"
    />
  </td>

  <td className="p-2 border">
    <input
      type="text"
      value={p.transactionId || ""}
      onChange={(e) =>
        handleChange(p.id, "transactionId", e.target.value)
      }
      className="border px-2 py-1 rounded"
    />
  </td>
</tr>

                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-right">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaSave />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}