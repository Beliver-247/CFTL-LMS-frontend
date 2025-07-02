import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';


export default function AdminProfileForm() {
  const [form, setForm] = useState({
    fullName: '',
    nameInitials: '',
    telephone: '',
    altTelephone: '',
    email: '',
  });

  useEffect(() => {
  const user = auth.currentUser;
  if (user) {
    setForm(prev => ({
      ...prev,
      fullName: user.displayName || '',
      email: user.email || ''
    }));
  }
}, []);

  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const formData = new FormData();
  formData.append('fullName', form.fullName);
  formData.append('nameInitials', form.nameInitials);
  formData.append('telephone', form.telephone);
  formData.append('altTelephone', form.altTelephone);
  formData.append('email', form.email); // include email here
  if (profilePicture) {
    formData.append('profilePicture', profilePicture);
  }

  try {
    const token = localStorage.getItem('adminToken');
    await axios.post('http://localhost:5000/api/admins', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    navigate('/admin-dashboard');
  } catch (err) {
    setError(err.response?.data?.error || 'Profile creation failed');
  }
};


  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Complete Your Admin Profile</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="nameInitials"
          placeholder="Name with Initials"
          value={form.nameInitials}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="telephone"
          placeholder="Telephone"
          value={form.telephone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="altTelephone"
          placeholder="Alternative Telephone (optional)"
          value={form.altTelephone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
<input
  type="file"
  accept="image/*"
  onChange={(e) => setProfilePicture(e.target.files[0])}
/>

{profilePicture && (
  <img
    src={URL.createObjectURL(profilePicture)}
    alt="Preview"
    className="mt-4 w-32 h-32 object-cover rounded"
  />
)}


        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Profile
        </button>
      </form>
    </div>
  );
}
