// components/RegistrationRequestModal.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function RegistrationRequestModal({ onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'OL',
    stream: '',
    year: '',
    duration: '6 month',
    startingMonth: ''
  });
  const [streamsVisible, setStreamsVisible] = useState(false);
  const [months, setMonths] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${baseURL}/api/registration-requests/starting-months`)
      .then(res => {
        setMonths(res.data.months);
        setForm(f => ({ ...f, startingMonth: res.data.months[0] }));
      })
      .catch(() => setMonths([]));
  }, [baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === 'program') setStreamsVisible(value === 'AL');
  };

  const validate = () => {
    if (form.name.trim().split(' ').length < 2) return 'Name must have at least two words.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email address.';
    if (!/^\d{10}$/.test(form.phone)) return 'Phone number must be exactly 10 digits.';
    if (form.program === 'AL' && !form.stream) return 'Stream is required for AL program.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      await axios.post(`${baseURL}/api/registration-requests`, form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-red-800">Registration Request</h2>

        {success ? (
          <div className="text-green-600 text-center mb-4">Your request has been submitted successfully.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} maxLength="10" placeholder="Phone Number (10 digits)" className="w-full border p-2 rounded" required />
            <select name="program" value={form.program} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="OL">OL</option>
              <option value="AL">AL</option>
            </select>
            {streamsVisible && (
              <select name="stream" value={form.stream} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Stream</option>
                <option value="Biology">Biology</option>
                <option value="Maths">Maths</option>
                <option value="Tech">Tech</option>
                <option value="Art">Art</option>
                <option value="Commerce">Commerce</option>
              </select>
            )}
            <input type="text" name="year" value={form.year} onChange={handleChange} placeholder="Academic Year (e.g., 2025)" className="w-full border p-2 rounded" required />
            <select name="duration" value={form.duration} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="6 month">6 Month</option>
              <option value="1 year">1 Year</option>
            </select>
            <input type="text" value={form.startingMonth} readOnly className="w-full border p-2 rounded bg-gray-100 text-gray-600" />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button type="submit" className="w-full bg-red-700 text-white py-2 rounded hover:bg-red-800">Submit Request</button>
          </form>
        )}

        <button onClick={onClose} className="mt-4 w-full text-center text-sm text-red-700 hover:underline">
          Close
        </button>
      </div>
    </div>
  );
}
