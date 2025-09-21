// pages/TeacherPages/UpdateSubjectStatus.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UpdateSubjectStatus() {
  const { subjectId } = useParams(); // ✅ was courseId
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Prefer a teacher-specific token; fall back to 'token' if that's what you used earlier
  const token =
    localStorage.getItem('teacherToken') ||
    localStorage.getItem('token');

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [syllabus, setSyllabus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const fetchSyllabus = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      // ✅ subject-based fetch
      const res = await axios.get(
        `${baseURL}/api/syllabus/subject/${subjectId}/${month}`,
        { headers: authHeaders }
      );
      setSyllabus(res.data);
      setMessage('');
    } catch (err) {
      setSyllabus(null);
      setMessage(
        err?.response?.data?.error ||
        'No syllabus found for the selected month.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, subjectId]);

  const markSubtopicComplete = async (weekNumber, topicIndex, subIndex) => {
    if (!token) {
      setMessage('You must be logged in to perform this action.');
      return;
    }
    if (!syllabus?.id) {
      setMessage('Syllabus not loaded.');
      return;
    }

    try {
      // ✅ new backend path adds "/complete" at the end
      const res = await axios.patch(
        `${baseURL}/api/syllabus/${syllabus.id}/weeks/${weekNumber}/topics/${topicIndex}/subtopics/${subIndex}/complete`,
        {},
        { headers: { ...authHeaders, 'Content-Type': 'application/json' } }
      );
      setMessage(res.data?.message || 'Marked complete.');
      fetchSyllabus();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to mark subtopic complete.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Update Teaching Status</h1>

      <div className="mb-4">
        <label className="font-semibold">Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="ml-2 border px-3 py-1 rounded"
        />
      </div>

      {loading ? (
        <p>Loading syllabus...</p>
      ) : syllabus ? (
        <div className="space-y-4">
          {(syllabus.weeks || []).map((week, weekIdx) => (
            <div key={weekIdx} className="border rounded p-4">
              <h2 className="text-lg font-bold mb-2">Week {week.weekNumber}</h2>

              {(week.topics || []).map((topic, topicIdx) => (
                <div key={topicIdx} className="ml-4">
                  <h3 className="font-semibold">Topic: {topic.title}</h3>
                  <ul className="ml-4 mt-2">
                    {(topic.subtopics || []).map((sub, subIdx) => {
                      const isCompleted = sub.status === 'completed' || sub.completed;
                      const isApproved = !!sub.approved;
                      const pendingApproval = isCompleted && !isApproved;

                      return (
                        <li key={subIdx} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            disabled={isCompleted} // can't re-complete
                            onChange={() =>
                              markSubtopicComplete(week.weekNumber, topicIdx, subIdx)
                            }
                          />
                          <span>
                            {sub.title}
                            {pendingApproval && (
                              <span className="text-yellow-600 ml-2 text-sm">
                                (Awaiting Approval)
                              </span>
                            )}
                            {isApproved && (
                              <span className="text-green-600 ml-2 text-sm">
                                (Approved)
                              </span>
                            )}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
