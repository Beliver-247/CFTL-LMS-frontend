import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreateSubject() {
  const [form, setForm] = useState({
    subjectName: '',
    program: '',
    stream: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear stream when program changes to OL
    if (name === 'program' && value === 'OL') {
      setForm(prev => ({ ...prev, stream: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        subjectName: form.subjectName.trim(),
        program: form.program.trim().toUpperCase(),
      };

      if (form.program === 'AL') {
        if (!form.stream) {
          setError('Stream is required for AL program');
          return;
        }
        payload.stream = form.stream.trim().toLowerCase();
      }

      await axios.post(`${baseURL}/api/subjects`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Subject created successfully!');
      setForm({ subjectName: '', program: '', stream: '' });

      // Optional redirect:
      // navigate('/admin/subjects');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create subject');
    }
  };

  const showStreamField = form.program === 'AL';

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Subject</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}

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
            placeholder="e.g., Chemistry"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Program</label>
          <select
            name="program"
            value={form.program}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="">Select Program</option>
            <option value="OL">OL</option>
            <option value="AL">AL</option>
          </select>
        </div>

        {showStreamField && (
          <div>
            <label className="block font-medium mb-1">Stream</label>
            <select
              name="stream"
              value={form.stream}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select Stream</option>
              <option value="biology">Biology</option>
              <option value="maths">Maths</option>
              <option value="tech">Tech</option>
              <option value="art">Art</option>
              <option value="commerce">Commerce</option>
            </select>
          </div>
        )}

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
