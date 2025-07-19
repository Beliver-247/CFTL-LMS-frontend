// pages/TeacherPages/UpdateCourseStatus.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UpdateCourseStatus() {
  const { courseId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token');
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [syllabus, setSyllabus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSyllabus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/syllabus/${courseId}/${month}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSyllabus(res.data);
      setMessage('');
    } catch (err) {
      setMessage('No syllabus found for the selected month.');
      setSyllabus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, [month]);

  const markSubtopicComplete = async (weekNumber, topicIndex, subIndex) => {
    if (!token) {
      setMessage('You must be logged in to perform this action.');
      return;
    }

    try {
      const res = await axios.patch(
        `${baseURL}/api/syllabus/${syllabus.id}/weeks/${weekNumber}/topics/${topicIndex}/subtopics/${subIndex}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(res.data.message);
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
          {syllabus.weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="border rounded p-4">
              <h2 className="text-lg font-bold mb-2">Week {week.weekNumber}</h2>
              {week.topics.map((topic, topicIdx) => (
                <div key={topicIdx} className="ml-4">
                  <h3 className="font-semibold">Topic: {topic.title}</h3>
                  <ul className="ml-4 mt-2">
                    {topic.subtopics.map((sub, subIdx) => (
                      <li key={subIdx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sub.status === 'complete'}
                          disabled={sub.status === 'complete' || sub.pendingApproval}
                          onChange={() =>
                            markSubtopicComplete(week.weekNumber, topicIdx, subIdx)
                          }
                        />
                        <span>
                          {sub.title}
                          {sub.pendingApproval && (
                            <span className="text-yellow-600 ml-2 text-sm">(Pending Approval)</span>
                          )}
                        </span>
                      </li>
                    ))}
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
