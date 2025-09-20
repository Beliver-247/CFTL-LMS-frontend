// src/pages/coordinator/CoordinatorPendingRegistrations.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import EnrollmentCreator from "../../components/admin/EnrollmentCreator"; // reuse the same modal

export default function CoordinatorPendingRegistrations() {
  const [rows, setRows] = useState([]); // pending students scoped to my courses
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [myCourses, setMyCourses] = useState([]); // [{ id, name, ... }]
  const [courseMap, setCourseMap] = useState({}); // id -> course name
  const [subjectMap, setSubjectMap] = useState({}); // id -> subject name

  const [selected, setSelected] = useState(null); // student selected to create enrollment
  const [filterCourseId, setFilterCourseId] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        // 1) My courses and current enrollments in my courses
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get("/api/courses/coordinator/courses"),
          api.get("/api/enrollments/coordinator"),
        ]);

        const myCoursesData = coursesRes.data || [];
        setMyCourses(myCoursesData);

        const courseIdSet = new Set(myCoursesData.map((c) => c.id));
        const courseNameMap = {};
        myCoursesData.forEach((c) => (courseNameMap[c.id] = c.name || c.title || c.id));
        setCourseMap(courseNameMap);

        // Enrolled students in my courses (to exclude from pending)
        const enrolledStudentIds = new Set(
          (enrollmentsRes.data || []).map((en) => en.student?.id || en.studentId)
        );

        // 2) Subjects map (for pretty names)
        const subjectsRes = await api.get("/api/subjects/all");
        const smap = {};
        (subjectsRes.data || []).forEach((s) => (smap[s.id] = s.subjectName));
        setSubjectMap(smap);

        // 3) All students → filter to pending in my courses
        const studentsRes = await api.get("/api/students");
        const students = studentsRes.data || [];

        const pending = students.filter((stu) => {
          const prefCourseId = stu?.enrollmentPreferences?.courseId;
          if (!prefCourseId) return false;
          if (!courseIdSet.has(prefCourseId)) return false; // not my course
          if (enrolledStudentIds.has(stu.id)) return false; // already enrolled in my courses
          return true;
        });

        setRows(pending);
      } catch (e) {
        setErr(e?.response?.data?.error || "Failed to load coordinator data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredRows = useMemo(() => {
    let r = rows;
    if (filterCourseId !== "all") {
      r = r.filter((s) => s?.enrollmentPreferences?.courseId === filterCourseId);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      r = r.filter(
        (s) =>
          s.nameFull?.toLowerCase().includes(q) ||
          s.registrationNo?.toString().toLowerCase().includes(q)
      );
    }
    return r;
  }, [rows, filterCourseId, search]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  if (!myCourses.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">Pending Registrations</h1>
        <p className="text-gray-600">
          You don’t seem to be assigned to any courses yet.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pending Registrations (My Courses)</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or reg no…"
            className="px-3 py-2 border rounded"
          />
          <select
            value={filterCourseId}
            onChange={(e) => setFilterCourseId(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All my courses</option>
            {myCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {courseMap[c.id]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filteredRows.length === 0 ? (
          <div>No pending registrations 🎉</div>
        ) : (
          filteredRows.map((student) => {
            const prefs = student.enrollmentPreferences || {};
            const subjects = (prefs.subjects || []).map((id) => subjectMap[id] || id);

            return (
              <div
                key={student.id}
                className="flex items-center justify-between border rounded p-3"
              >
                <div>
                  <div className="font-medium">{student.nameFull}</div>
                  <div className="text-sm text-gray-600">
                    Reg No: {student.registrationNo}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <div>
                      <span className="font-medium">Course:</span>{" "}
                      {courseMap[prefs.courseId] || prefs.courseId || "-"}
                    </div>
                    {prefs.stream && (
                      <div>
                        <span className="font-medium">Stream:</span> {prefs.stream}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Subjects:</span>{" "}
                      {subjects.length ? subjects.join(" • ") : "-"}
                    </div>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={() => setSelected(student)}
                >
                  Create Enrollment
                </button>
              </div>
            );
          })
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
