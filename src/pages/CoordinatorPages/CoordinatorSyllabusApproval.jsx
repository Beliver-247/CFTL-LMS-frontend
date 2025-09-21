// pages/CoordinatorPages/CoordinatorSyllabusApproval.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CoordinatorSyllabusApproval() {
  const { subjectId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [syllabus, setSyllabus] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchSyllabus = async () => {
    if (!subjectId) return;
    setLoading(true);
    try {
      // ✅ use the admin/coordinator GET
      const res = await axios.get(
        `${baseURL}/api/syllabus/admin/subject/${subjectId}/${month}`,
        { headers }
      );
      setSyllabus(res.data);
      setMessage('');
    } catch (err) {
      setSyllabus(null);
      setMessage(err?.response?.data?.error || 'No syllabus found for the selected month.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, subjectId]);

  const approveAll = async () => {
    if (!syllabus?.id) return;
    try {
      const res = await axios.patch(`${baseURL}/api/syllabus/${syllabus.id}/approve`, {}, { headers });
      setMessage(res.data?.message || 'Approved.');
      fetchSyllabus();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to approve changes.');
    }
  };

  const approveTopic = async (weekNumber, topicIdx) => {
    if (!syllabus?.id) return;
    try {
      const res = await axios.patch(
        `${baseURL}/api/syllabus/${syllabus.id}/weeks/${weekNumber}/topics/${topicIdx}/approve`,
        {},
        { headers }
      );
      setMessage(res.data?.message || 'Topic approved.');
      fetchSyllabus();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to approve topic.');
    }
  };

  const approveSubtopic = async (weekNumber, topicIdx, subIdx) => {
    if (!syllabus?.id) return;
    try {
      const res = await axios.patch(
        `${baseURL}/api/syllabus/${syllabus.id}/weeks/${weekNumber}/topics/${topicIdx}/subtopics/${subIdx}/approve`,
        {},
        { headers }
      );
      setMessage(res.data?.message || 'Subtopic approved.');
      fetchSyllabus();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to approve subtopic.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4">Approve Syllabus Updates</h1>

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

              {(week.topics || []).map((topic, topicIdx) => {
                const topicApproved = !!topic.approved;
                const topicHasPending =
                  (topic.subtopics || []).some((s) => (s.completed || s.status === 'completed') && !s.approved) || !topicApproved;

                return (
                  <div key={topicIdx} className="ml-4 mb-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Topic: {topic.title}</h3>
                      {topicHasPending && (
                        <button
                          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          onClick={() => approveTopic(week.weekNumber, topicIdx)}
                        >
                          Approve Topic
                        </button>
                      )}
                    </div>

                    <ul className="ml-4 mt-2">
                      {(topic.subtopics || []).map((sub, subIdx) => {
                        const isCompleted = sub.completed || sub.status === 'completed';
                        const isApproved = !!sub.approved;
                        const pendingApproval = isCompleted && !isApproved;

                        return (
                          <li key={subIdx} className="flex items-center gap-2 justify-between">
                            <span>
                              {sub.title}
                              {pendingApproval && (
                                <span className="text-yellow-600 ml-2 text-sm">(Pending Approval)</span>
                              )}
                              {isApproved && (
                                <span className="text-green-600 ml-2 text-sm">(Approved)</span>
                              )}
                            </span>

                            {pendingApproval && (
                              <button
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                                onClick={() => approveSubtopic(week.weekNumber, topicIdx, subIdx)}
                              >
                                Approve
                              </button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          ))}

          <div className="text-center mt-6">
            <button
              onClick={approveAll}
              className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800"
            >
              Approve All Pending Changes
            </button>
          </div>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
