import { useEffect, useMemo, useState } from "react";
import api from "../../api"; // <-- use your auth'd axios client
import { useNavigate } from "react-router-dom";

const validStreams = ["biology", "maths", "tech", "art", "commerce"];

export default function CreateCourse() {
  const [form, setForm] = useState({
    name: "",
    program: "AL",
    year: "",
    duration: "6 Months",
    coordinatorEmail: "",
    totalFee: "",
    startDate: "",
    endDate: "",

    // OL selections
    olSelectedOptional: [],

    // AL selections
    alCommonSelected: [],
    alSelectedByStream: {}, // {streamKey: [subjectIds]}
  });

  const [error, setError] = useState("");
  const [olMandatory, setOlMandatory] = useState([]); // [{id, subjectName, ...}]
  const [olOptional, setOlOptional] = useState([]);   // [{id, subjectName, ...}]
  const [alByStream, setAlByStream] = useState({});   // {streamKey: [{id, subjectName, ...}]}
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch subjects depending on program
  useEffect(() => {
    const fetchSubjects = async () => {
      setError("");
      setLoading(true);
      try {
        if (form.program === "OL") {
          // Get all OL subjects (has isMandatory flag)
          const { data } = await api.get(`/api/subjects?program=OL`);
          const mandatory = data.filter((s) => s.isMandatory);
          const optional = data.filter((s) => !s.isMandatory);
          setOlMandatory(mandatory);
          setOlOptional(optional);
        } else if (form.program === "AL") {
          // Fetch per stream; build map
          const entries = await Promise.all(
            validStreams.map(async (stream) => {
              const { data } = await api.get(`/api/subjects?program=AL&stream=${stream}`);
              return [stream, data];
            })
          );
          const map = Object.fromEntries(entries);
          setAlByStream(map);
        }
      } catch (e) {
        setError("Failed to fetch subjects.");
        setOlMandatory([]);
        setOlOptional([]);
        setAlByStream({});
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [form.program]);

  const alAllSubjects = useMemo(() => {
    // Flatten AL subjects across streams to pick "commonSubjects" from anywhere
    const all = Object.values(alByStream).flat();
    const seen = new Set();
    const unique = [];
    for (const s of all) {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        unique.push(s);
      }
    }
    return unique;
  }, [alByStream]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset program-specific selections when program changes
    if (name === "program") {
      setForm((prev) => ({
        ...prev,
        program: value,
        olSelectedOptional: [],
        alCommonSelected: [],
        alSelectedByStream: {},
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleArrayValue = (stateKey, id) => {
    setForm((prev) => {
      const arr = new Set(prev[stateKey] || []);
      if (arr.has(id)) arr.delete(id);
      else arr.add(id);
      return { ...prev, [stateKey]: Array.from(arr) };
    });
  };

  const toggleStreamSubject = (streamKey, id) => {
    setForm((prev) => {
      const copy = { ...(prev.alSelectedByStream || {}) };
      const set = new Set(copy[streamKey] || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      copy[streamKey] = Array.from(set);
      return { ...prev, alSelectedByStream: copy };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic required
    if (!form.name || !form.program || !form.year || !form.duration || !form.coordinatorEmail || !form.totalFee || !form.startDate || !form.endDate) {
      setError("Please fill all required fields (including start/end dates).");
      return;
    }

    try {
      const payload = {
        name: form.name.trim(),
        program: form.program.toUpperCase(), // "OL" | "AL"
        year: form.year.trim(),
        duration: form.duration,
        coordinatorEmail: form.coordinatorEmail.trim(),
        totalFee: parseFloat(form.totalFee),
        startDate: form.startDate, // backend converts to Timestamp
        endDate: form.endDate,
      };

      if (payload.program === "OL") {
        payload.mandatorySubjects = olMandatory.map((s) => s.id);         // fixed by backend data
        payload.optionalSubjects = form.olSelectedOptional || [];
        if (!Array.isArray(payload.optionalSubjects)) payload.optionalSubjects = [];
      } else {
        // AL
        payload.commonSubjects = form.alCommonSelected || [];
        // Only include streams that actually have selections
        const obj = {};
        for (const key of validStreams) {
          const arr = form.alSelectedByStream?.[key] || [];
          if (arr.length > 0) obj[key] = arr;
        }
        payload.streams = obj;

        // minimal sanity
        if (!Array.isArray(payload.commonSubjects)) payload.commonSubjects = [];
        if (!payload.streams || Object.keys(payload.streams).length === 0) {
          // It’s allowed by backend to have an empty object? (It requires streams object with valid keys)
          // We’ll require at least one stream selection for safety:
          setError("Please select at least one subject for at least one AL stream.");
          return;
        }
      }

      await api.post(`/api/courses`, payload);
      navigate("/admin/manage-courses");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create course");
    }
  };

  const isOL = form.program === "OL";
  const isAL = form.program === "AL";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Course</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basics */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium mb-1">Program</label>
            <select
              name="program"
              value={form.program}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="OL">OL</option>
              <option value="AL">AL</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Year</label>
            <input
              type="text"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
              placeholder="e.g., 2025"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium mb-1">Duration</label>
            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="6 Months">6 Months</option>
              <option value="1 Year">1 Year</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Coordinator Email</label>
            <input
              type="email"
              name="coordinatorEmail"
              value={form.coordinatorEmail}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium mb-1">Total Fee (LKR)</label>
            <input
              type="number"
              name="totalFee"
              value={form.totalFee}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ---------------- OL UI ---------------- */}
        {isOL && (
          <div className="space-y-3 border rounded-lg p-3">
            <div>
              <div className="font-semibold mb-1">Mandatory Subjects (from OL catalog)</div>
              {loading ? (
                <div className="text-sm text-gray-500">Loading…</div>
              ) : (
                <ul className="text-sm bg-gray-50 rounded p-2 max-h-32 overflow-auto">
                  {olMandatory.map((s) => (
                    <li key={s.id}>{s.subjectName}</li>
                  ))}
                  {olMandatory.length === 0 && (
                    <li className="text-amber-700">No mandatory OL subjects found.</li>
                  )}
                </ul>
              )}
            </div>

            <div>
              <div className="font-semibold mb-1">Select Optional Subjects (any number)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-auto border rounded p-2">
                {olOptional.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.olSelectedOptional.includes(s.id)}
                      onChange={() => toggleArrayValue("olSelectedOptional", s.id)}
                    />
                    <span>{s.subjectName}</span>
                  </label>
                ))}
                {olOptional.length === 0 && (
                  <div className="text-amber-700 text-sm">No optional OL subjects found.</div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                (Students can choose up to 4 optional subjects at enrollment; the course can list more.)
              </p>
            </div>
          </div>
        )}

        {/* ---------------- AL UI ---------------- */}
        {isAL && (
          <div className="space-y-5 border rounded-lg p-3">
            <div>
              <div className="font-semibold mb-1">Select Common Subjects (across AL)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-auto border rounded p-2">
                {alAllSubjects.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.alCommonSelected.includes(s.id)}
                      onChange={() => toggleArrayValue("alCommonSelected", s.id)}
                    />
                    <span>{s.subjectName} {!!s.stream && <em className="text-gray-500">({s.stream})</em>}</span>
                  </label>
                ))}
                {alAllSubjects.length === 0 && (
                  <div className="text-amber-700 text-sm">No AL subjects found. Create subjects first.</div>
                )}
              </div>
            </div>

            {validStreams.map((streamKey) => (
              <div key={streamKey}>
                <div className="font-semibold mb-1">
                  {streamKey.charAt(0).toUpperCase() + streamKey.slice(1)} Stream Subjects
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-auto border rounded p-2">
                  {(alByStream[streamKey] || []).map((s) => (
                    <label key={s.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={(form.alSelectedByStream?.[streamKey] || []).includes(s.id)}
                        onChange={() => toggleStreamSubject(streamKey, s.id)}
                      />
                      <span>{s.subjectName}</span>
                    </label>
                  ))}
                  {(alByStream[streamKey] || []).length === 0 && (
                    <div className="text-amber-700 text-sm">No subjects in this stream yet.</div>
                  )}
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500">
              (At enrollment, students must pick exactly 3 subjects from their chosen stream; the course can list many.)
            </p>
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
}
