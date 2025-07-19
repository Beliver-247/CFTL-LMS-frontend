// pages/CoordinatorPages/CoordinatorSyllabusApproval.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function CoordinatorSyllabusApproval() {
  const { courseId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('adminToken');
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

  const approveChanges = async () => {
    try {
      const res = await axios.post(`${baseURL}/api/syllabus/${syllabus.id}/approval`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message);
      fetchSyllabus();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to approve changes.');
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
          {syllabus.weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="border rounded p-4">
              <h2 className="text-lg font-bold mb-2">Week {week.weekNumber}</h2>
              {week.topics.map((topic, topicIdx) => (
                <div key={topicIdx} className="ml-4">
                  <h3 className="font-semibold">Topic: {topic.title}</h3>
                  <ul className="ml-4 mt-2">
                    {topic.subtopics.map((sub, subIdx) => (
                      <li key={subIdx} className="flex items-center gap-2">
                        <span>
                          {sub.title}
                          {sub.pendingApproval && (
                            <span className="text-yellow-600 ml-2 text-sm">(Pending Approval)</span>
                          )}
                          {sub.approvedAt && (
                            <span className="text-green-600 ml-2 text-sm">(Approved)</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}

          <div className="text-center mt-6">
            <button
              onClick={approveChanges}
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
