import { useEffect, useState, useMemo } from "react";
import api from "../../api";
import EnrollmentCreator from "../../components/admin/EnrollmentCreator";

export default function PendingRegistrations() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null); // { student, prefs? }

  useEffect(() => {
    (async () => {
      try {
        // Admin-only route returning [{ student, course }]
        const { data } = await api.get("/api/enrollments/all");
        // Pending = those with no course enrolled yet
        const pending = data.filter((r) => !r.course).map((r) => r.student);
        setRows(pending);
      } catch (e) {
        setErr(e?.response?.data?.error || "Failed to load pending registrations.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Pending Registrations</h1>
      <div className="space-y-2">
        {rows.length === 0 ? (
          <div>No pending registrations 🎉</div>
        ) : (
          rows.map((student) => (
            <div key={student.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-medium">{student.nameFull}</div>
                <div className="text-sm text-gray-600">Reg No: {student.registrationNo}</div>
                {student.enrollmentPreferences && (
                  <div className="text-xs text-gray-500 mt-1">
                    Prefs: {JSON.stringify(student.enrollmentPreferences)}
                  </div>
                )}
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setSelected(student)}
              >
                Create Enrollment
              </button>
            </div>
          ))
        )}
      </div>

      {selected && (
        <EnrollmentCreator
          student={selected}
          onClose={() => setSelected(null)}
          onCreated={() => {
            // After enrollment created, remove from list
            setRows((prev) => prev.filter((s) => s.id !== selected.id));
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
