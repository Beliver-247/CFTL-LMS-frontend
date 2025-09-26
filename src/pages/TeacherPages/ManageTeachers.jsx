import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getFreshToken } from "../../utils/authToken";
import { motion } from "framer-motion";
import { FaPlus, FaTrash, FaEdit, FaChalkboardTeacher } from "react-icons/fa";

export default function ManageTeachers() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // teacher object or null
  const [form, setForm] = useState({ name: "", email: "", phone: "", type: "full-time", salary: "" });
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter(t =>
      [t.name, t.email, t.phone, t.type].filter(Boolean).some(v => String(v).toLowerCase().includes(q))
    );
  }, [teachers, search]);

  useEffect(() => {
    const preload = async () => {
      setLoading(true);
      try {
        const token = await getFreshToken();
        if (!token) {
          navigate("/admin-login");
          return;
        }
        const res = await axios.get(`${baseURL}/api/teachers`);
        setTeachers(res.data || []);
        // If coming from "Assign Subjects" flow, pre-open editor for context
        const id = params.get("focusId");
        if (id) {
          const t = res.data.find(x => x.id === id);
          if (t) {
            setEditing(t);
            setForm({
              name: t.name || "",
              email: t.email || "",
              phone: t.phone || "",
              type: t.type || "full-time",
              salary: t.salary || "",
            });
            setShowForm(true);
          }
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };
    preload();
  }, [baseURL, navigate, params]);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", type: "full-time", salary: "" });
  };

  const openCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (payload.salary === "") delete payload.salary;
      if (editing) {
        setBusyId(editing.id);
        await axios.put(`${baseURL}/api/teachers/${editing.id}`, payload);
      } else {
        await axios.post(`${baseURL}/api/teachers`, payload);
      }
      const res = await axios.get(`${baseURL}/api/teachers`);
      setTeachers(res.data || []);
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  const onEdit = (t) => {
    setEditing(t);
    setForm({
      name: t.name || "",
      email: t.email || "",
      phone: t.phone || "",
      type: t.type || "full-time",
      salary: t.salary || "",
    });
    setShowForm(true);
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this teacher? This cannot be undone.")) return;
    try {
      setBusyId(id);
      await axios.delete(`${baseURL}/api/teachers/${id}`);
      setTeachers(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  const goAssignSubjects = (t) => {
    navigate(`/admin/assign-subjects-to-teacher?teacherId=${t.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-90 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaChalkboardTeacher className="text-red-500" /> Manage Teachers
          </h1>
          <button onClick={openCreate} className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <FaPlus /> New Teacher
          </button>
        </div>

        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone or type"
            className="w-full md:w-96 px-4 py-2 rounded-lg text-gray-900"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white text-gray-800 rounded-3xl shadow-xl p-5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-lg font-bold text-red-700">{t.name || "(no name)"}</h2>
                  <p className="text-sm text-gray-700">{t.email}</p>
                  {t.phone && <p className="text-sm text-gray-700">{t.phone}</p>}
                  <div className="mt-2 text-xs text-gray-600">Type: {t.type || "—"}</div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => onEdit(t)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                  disabled={busyId === t.id}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => goAssignSubjects(t)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm"
                >
                  Assign Subjects
                </button>
                <button
                  onClick={() => onDelete(t.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm inline-flex items-center gap-2"
                  disabled={busyId === t.id}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6">
              <h3 className="text-xl font-bold mb-4">{editing ? "Edit Teacher" : "Create Teacher"}</h3>
              <form onSubmit={submitForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Salary (optional)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); resetForm(); }}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-800"
                    disabled={!!busyId}
                  >
                    {editing ? "Save Changes" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}