import { useEffect, useMemo, useState } from "react";
import api from "../../api";

export default function EnrollmentCreator({ student, onClose, onCreated }) {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState(student?.enrollmentPreferences?.courseId || "");
  const [stream, setStream] = useState(student?.enrollmentPreferences?.stream || "");
  const [selectedSubjects, setSelectedSubjects] = useState(student?.enrollmentPreferences?.subjects || []);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/courses"); // open to all; ok to call here
        setCourses(data);
      } catch (e) {
        setErr("Failed to load courses.");
      }
    })();
  }, []);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId]
  );

  const handleSubjectToggle = (id, cap) => {
    setSelectedSubjects((prev) => {
      const has = prev.includes(id);
      if (has) return prev.filter((x) => x !== id);
      if (prev.length < cap) return [...prev, id];
      return prev;
    });
  };

  async function createEnrollment() {
    try {
      setErr("");
      if (!courseId) return setErr("Please select a course.");

      if (selectedCourse?.program === "AL") {
        if (!stream) return setErr("Please select a stream for AL.");
        if (selectedSubjects.length !== 3) return setErr("Pick exactly 3 subjects for AL.");
      }
      if (selectedCourse?.program === "OL") {
        if (selectedSubjects.length > 4) return setErr("Pick up to 4 optional subjects for OL.");
      }

      setSubmitting(true);
      const { data } = await api.post("/api/enrollments", {
        studentId: student.id,
        courseId,
        stream: stream || null,
        subjects: selectedSubjects,
      });

      // If you want initial status inactive, either PATCH here or change default in backend once:
      // await api.patch(`/api/enrollments/${data.id}/status`, { status: "inactive" });

      onCreated?.(data);
    } catch (e) {
      const msg = e?.response?.data?.error || "Failed to create enrollment.";
      const friendly =
        msg.includes("active enrollment") ? "Student already has an active enrollment." :
        msg.includes("inactive enrollment in this course") ? "An inactive enrollment for this course already exists." :
        msg;
      setErr(friendly);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Create Enrollment</h2>
          <button className="text-gray-500" onClick={onClose}>✕</button>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-700">
            <div className="font-medium">{student.nameFull}</div>
            <div>Reg No: {student.registrationNo}</div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setStream("");
                setSelectedSubjects([]);
              }}
            >
              <option value="">-- Select a course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {selectedCourse?.program === "AL" && (
            <div>
              <label className="block text-sm font-medium mb-1">Stream</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={stream}
                onChange={(e) => {
                  setStream(e.target.value);
                  setSelectedSubjects([]);
                }}
              >
                <option value="">-- Select a stream --</option>
                {selectedCourse.streams && Object.keys(selectedCourse.streams).map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>

              {stream && (
                <>
                  <div className="mt-3 text-sm font-medium">Common Subjects</div>
                  <ul className="text-sm bg-gray-50 rounded p-2">
                    {selectedCourse.commonSubjects?.map((id) => (
                      <li key={id}>{id}</li>
                    ))}
                  </ul>

                  <div className="mt-3 text-sm font-medium">Choose 3 subjects from {stream}</div>
                  <div className="space-y-1 max-h-48 overflow-auto border rounded p-2">
                    {selectedCourse.streams[stream].map((id) => (
                      <label key={id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(id)}
                          onChange={() => handleSubjectToggle(id, 3)}
                          disabled={selectedSubjects.length >= 3 && !selectedSubjects.includes(id)}
                        />
                        <span>{id}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {selectedCourse?.program === "OL" && (
            <div>
              <div className="text-sm font-medium">Mandatory Subjects</div>
              <ul className="text-sm bg-gray-50 rounded p-2">
                {selectedCourse.mandatorySubjects?.map((id) => <li key={id}>{id}</li>)}
              </ul>

              <div className="mt-3 text-sm font-medium">Choose up to 4 optional subjects</div>
              <div className="space-y-1 max-h-48 overflow-auto border rounded p-2">
                {selectedCourse.optionalSubjects?.map((id) => (
                  <label key={id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(id)}
                      onChange={() => handleSubjectToggle(id, 4)}
                      disabled={selectedSubjects.length >= 4 && !selectedSubjects.includes(id)}
                    />
                    <span>{id}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {err && <div className="text-red-600 text-sm">{err}</div>}

          <div className="flex justify-end gap-2 pt-2">
            <button className="px-4 py-2 rounded border" onClick={onClose} disabled={submitting}>Cancel</button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white"
              onClick={createEnrollment}
              disabled={submitting}
            >
              {submitting ? "Creating…" : "Create Enrollment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
