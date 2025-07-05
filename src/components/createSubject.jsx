import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateSubject() {
  const [form, setForm] = useState({
    subjectName: '',
    grade: '10',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        subjectName: form.subjectName,
        grade: parseInt(form.grade),
      };

      await axios.post(`${baseURL}/api/subjects`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/admin/manage-subjects'); // Or wherever your subject list is
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create subject');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Subject</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Subject Name</label>
          <input
            type="text"
            name="subjectName"
            value={form.subjectName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Grade</label>
          <select
            name="grade"
            value={form.grade}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
            required
          >
            {[10, 11, 12, 13].map((g) => (
              <option key={g} value={g}>
                Grade {g}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Subject
        </button>
      </form>
    </div>
  );
}
