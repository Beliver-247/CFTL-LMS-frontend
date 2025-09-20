import { useMemo } from "react";

export default function EnrollToCourse({
  form,
  setForm,
  errors,
  courses,
  subjectNamesMap = {}, // NEW: id -> subjectName
}) {
  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === form.courseId),
    [form.courseId, courses]
  );

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setForm((prev) => ({
      ...prev,
      courseId,
      stream: "", // Reset stream and subjects on course change
      selectedSubjects: [],
    }));
  };

  const handleStreamChange = (e) => {
    const stream = e.target.value;
    setForm((prev) => ({
      ...prev,
      stream,
      selectedSubjects: [], // Reset subjects on stream change
    }));
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    const isChecked = e.target.checked;

    setForm((prev) => {
      const course = courses.find((c) => c.id === prev.courseId);
      if (!course) return prev;

      const isAL = course.program === "AL";
      const limit = isAL ? 3 : 4;

      let newSubjects = [...prev.selectedSubjects];
      if (isChecked) {
        if (!newSubjects.includes(subjectId)) {
          if (newSubjects.length < limit) newSubjects.push(subjectId);
        }
      } else {
        newSubjects = newSubjects.filter((id) => id !== subjectId);
      }
      return { ...prev, selectedSubjects: newSubjects };
    });
  };

  const renderSubjectName = (id) => subjectNamesMap[id] || id;

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">Enroll to Course</h3>

      <div className="space-y-4">
        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Course
          </label>
          <select
            name="courseId"
            value={form.courseId}
            onChange={handleCourseChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Please choose a course --</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="text-red-500 text-sm">{errors.courseId}</p>
          )}
        </div>

        {/* Stream (AL only) */}
        {selectedCourse?.program === "AL" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Stream
            </label>
            <select
              name="stream"
              value={form.stream}
              onChange={handleStreamChange}
              disabled={!form.courseId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select a stream --</option>
              {Object.keys(selectedCourse.streams || {}).map((stream) => (
                <option key={stream} value={stream}>
                  {stream.charAt(0).toUpperCase() + stream.slice(1)}
                </option>
              ))}
            </select>
            {errors.stream && (
              <p className="text-red-500 text-sm">{errors.stream}</p>
            )}
          </div>
        )}

        {/* AL: common + selectable */}
        {selectedCourse && form.stream && selectedCourse.program === "AL" && (
          <div>
            <h4 className="text-md font-medium text-gray-600 mb-2">
              Common Subjects
            </h4>
            <ul className="list-disc list-inside bg-gray-100 p-2 rounded">
              {(selectedCourse.commonSubjects || []).map((id) => (
                <li key={id}>{renderSubjectName(id)}</li>
              ))}
            </ul>

            <h4 className="text-md font-medium text-gray-600 my-2">
              Choose <span className="font-semibold">exactly 3</span> subjects from your stream
            </h4>
            <div className="space-y-1">
              {(selectedCourse.streams?.[form.stream] || []).map((id) => (
                <label key={id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={id}
                    checked={form.selectedSubjects.includes(id)}
                    onChange={handleSubjectChange}
                    disabled={
                      form.selectedSubjects.length >= 3 &&
                      !form.selectedSubjects.includes(id)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {renderSubjectName(id)}
                  </span>
                </label>
              ))}
            </div>
            {errors.selectedSubjects && (
              <p className="text-red-500 text-sm">{errors.selectedSubjects}</p>
            )}
          </div>
        )}

        {/* OL: mandatory + selectable optional */}
        {selectedCourse && selectedCourse.program === "OL" && (
          <div>
            <h4 className="text-md font-medium text-gray-600 mb-2">
              Mandatory Subjects
            </h4>
            <ul className="list-disc list-inside bg-gray-100 p-2 rounded">
              {(selectedCourse.mandatorySubjects || []).map((id) => (
                <li key={id}>{renderSubjectName(id)}</li>
              ))}
            </ul>

            <h4 className="text-md font-medium text-gray-600 my-2">
              Choose up to 4 Optional Subjects
            </h4>
            <div className="space-y-1">
              {(selectedCourse.optionalSubjects || []).map((id) => (
                <label key={id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={id}
                    checked={form.selectedSubjects.includes(id)}
                    onChange={handleSubjectChange}
                    disabled={
                      form.selectedSubjects.length >= 4 &&
                      !form.selectedSubjects.includes(id)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {renderSubjectName(id)}
                  </span>
                </label>
              ))}
            </div>
            {errors.selectedSubjects && (
              <p className="text-red-500 text-sm">{errors.selectedSubjects}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}