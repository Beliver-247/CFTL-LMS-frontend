// pages/AdminPages/AssignSubjectsToTeachers.jsx
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AssignSubjectsToTeachers() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('info'); // 'success' | 'error' | 'info'
  const [loading, setLoading] = useState(true);
  const [prefillLoading, setPrefillLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  // Fetch teachers + subjects
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setMessage('');
      try {
        const [teacherRes, subjectRes] = await Promise.all([
          axios.get(`${baseURL}/api/teachers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          // Public minimal list: id, subjectName, program, stream, isMandatory
          axios.get(`${baseURL}/api/subjects/public`)
        ]);

        if (!mounted) return;
        setTeachers(Array.isArray(teacherRes.data) ? teacherRes.data : []);
        setSubjects(
          Array.isArray(subjectRes.data)
            ? subjectRes.data.sort((a, b) =>
                (a.program || '').localeCompare(b.program || '') ||
                (a.stream || '').localeCompare(b.stream || '') ||
                (a.subjectName || '').localeCompare(b.subjectName || '')
              )
            : []
        );
      } catch (err) {
        if (!mounted) return;
        setMsgType('error');
        setMessage('Failed to load teachers or subjects.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => { mounted = false; };
  }, [baseURL, token]);

  // When a teacher is selected, prefill currently assigned subjects
  useEffect(() => {
    let mounted = true;

    const prefill = async () => {
      if (!selectedTeacher) {
        setSelectedSubjects([]);
        return;
      }
      setPrefillLoading(true);
      setMessage('');
      try {
        const res = await axios.get(`${baseURL}/api/teachers/${selectedTeacher}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!mounted) return;
        const current = Array.isArray(res.data?.assignedSubjects)
          ? res.data.assignedSubjects
          : [];
        setSelectedSubjects(current);
      } catch (err) {
        if (!mounted) return;
        // Not fatal; just show a note
        setMsgType('error');
        setMessage('Could not load current subject assignments for this teacher.');
        setSelectedSubjects([]);
      } finally {
        if (mounted) setPrefillLoading(false);
      }
    };

    prefill();
    return () => { mounted = false; };
  }, [selectedTeacher, baseURL, token]);

  const handleSubjectToggle = (subjectId) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSelectAllVisible = () => {
    const visibleIds = filteredSubjects.map((s) => s.id);
    setSelectedSubjects((prev) => {
      const set = new Set(prev);
      let changed = false;
      for (const id of visibleIds) {
        if (!set.has(id)) {
          set.add(id);
          changed = true;
        }
      }
      return changed ? Array.from(set) : prev;
    });
  };

  const handleClearSelection = () => {
    setSelectedSubjects([]);
  };

  const handleSubmit = async () => {
    if (!selectedTeacher || selectedSubjects.length === 0) {
      setMsgType('error');
      setMessage('Please select a teacher and at least one subject.');
      return;
    }

    try {
      await axios.put(
        `${baseURL}/api/teachers/${selectedTeacher}/assign-subjects`,
        { assignedSubjects: selectedSubjects },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsgType('success');
      setMessage('Subjects assigned successfully!');
    } catch (err) {
      setMsgType('error');
      setMessage(err.response?.data?.error || 'Failed to assign subjects.');
    }
  };

  // Optional quick filters to help admins narrow the list
  const [programFilter, setProgramFilter] = useState('ALL'); // 'ALL' | 'OL' | 'AL'
  const [streamFilter, setStreamFilter] = useState('ALL');  // only applies to AL

  const streams = useMemo(() => {
    const set = new Set(
      subjects.filter((s) => s.program === 'AL' && s.stream).map((s) => s.stream)
    );
    return ['ALL', ...Array.from(set)];
  }, [subjects]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      if (programFilter !== 'ALL' && s.program !== programFilter) return false;
      if (programFilter === 'AL' && streamFilter !== 'ALL' && (s.stream || '') !== streamFilter) return false;
      return true;
    });
  }, [subjects, programFilter, streamFilter]);

  const messageStyles = useMemo(() => {
    if (msgType === 'success') return 'text-green-700';
    if (msgType === 'error') return 'text-red-700';
    return 'text-gray-700';
  }, [msgType]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Assign Subjects to Teacher</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-sm px-3 py-2 rounded border bg-white hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        {message && (
          <div className={`mb-4 text-center font-medium ${messageStyles}`}>
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Loading teachers & subjects…</div>
        ) : (
          <div className="space-y-6 bg-white p-5 rounded shadow">
            <div>
              <label className="font-semibold">Select Teacher:</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full mt-2 border px-4 py-2 rounded"
              >
                <option value="">-- Choose a teacher --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name || t.fullName || t.email}
                  </option>
                ))}
              </select>
              {prefillLoading && selectedTeacher && (
                <p className="text-sm text-gray-500 mt-1">Loading current assignments…</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-1">
                <label className="font-semibold">Filter Subjects:</label>
                <div className="mt-2 space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Program</span>
                    <select
                      value={programFilter}
                      onChange={(e) => setProgramFilter(e.target.value)}
                      className="w-full mt-1 border px-3 py-2 rounded"
                    >
                      <option value="ALL">All</option>
                      <option value="OL">OL</option>
                      <option value="AL">AL</option>
                    </select>
                  </div>

                  {programFilter === 'AL' && (
                    <div>
                      <span className="text-sm text-gray-600">Stream</span>
                      <select
                        value={streamFilter}
                        onChange={(e) => setStreamFilter(e.target.value)}
                        className="w-full mt-1 border px-3 py-2 rounded"
                      >
                        {streams.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllVisible}
                      className="text-sm px-3 py-2 rounded border bg-white hover:bg-gray-50"
                    >
                      Select all (filtered)
                    </button>
                    <button
                      type="button"
                      onClick={handleClearSelection}
                      className="text-sm px-3 py-2 rounded border bg-white hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="text-xs text-gray-600">
                    Selected: {selectedSubjects.length}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="font-semibold">Assign Subjects:</label>
                {filteredSubjects.length === 0 ? (
                  <p className="mt-2 text-gray-500 text-sm">No subjects match the current filters.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {filteredSubjects.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 p-2 rounded border">
                        <input
                          type="checkbox"
                          value={s.id}
                          checked={selectedSubjects.includes(s.id)}
                          onChange={() => handleSubjectToggle(s.id)}
                        />
                        <span className="text-sm">
                          {s.subjectName}{' '}
                          <span className="text-gray-600">
                            ({s.program}{s.stream ? ` / ${s.stream}` : ''}{s.program === 'OL' && s.isMandatory ? ', mandatory' : ''})
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedTeacher || selectedSubjects.length === 0}
                className="bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded hover:bg-blue-800"
              >
                Assign Subjects
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
