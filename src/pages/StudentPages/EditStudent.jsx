import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getFreshToken } from "../../utils/authToken";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/students/${id}`);
        const data = res.data;

        // Format DOB for date input
        if (data.dob?.seconds) {
          data.dob = new Date(data.dob.seconds * 1000).toISOString().split("T")[0];
        }

        // Ensure parent and nominee objects exist
        data.mother = data.parents?.mother || {};
        data.father = data.parents?.father || {};
        data.nominee = data.nominee || {};

        setForm(data);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError("Student not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await getFreshToken();

      // Prepare request body
      const updatedData = {
        ...form,
        parents: {
          mother: form.mother,
          father: form.father,
        },
        subjects: typeof form.subjects === "string" ? form.subjects.split(",").map((s) => s.trim()) : form.subjects,
      };

      await axios.put(`${baseURL}/api/students/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Student updated successfully.");
      navigate(`/admin/students/${id}`);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update student.");
    }
  };

  if (loading) return <div className="text-center p-10">Loading student data...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

 return (
  <div className="p-6 max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-blue-700">Edit Student</h2>

    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Basic Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Basic Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="nameFull" value={form.nameFull || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
            <input name="nic" value={form.nic || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
            <input name="telephone" value={form.telephone || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
            <input name="religion" value={form.religion || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" name="dob" value={form.dob || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Fees */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Fee Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registration Fee</label>
            <input name="registrationFee" type="number" value={form.registrationFee || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Fee</label>
            <input name="monthlyFee" type="number" value={form.monthlyFee || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pre Budget</label>
            <input name="preBudget" type="number" value={form.preBudget || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <input name="totalAmount" type="number" value={form.totalAmount || ""} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Mother Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Mother Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" value={form.mother?.name || ""} onChange={(e) => handleChange(e, "mother")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
            <input name="nic" value={form.mother?.nic || ""} onChange={(e) => handleChange(e, "mother")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={form.mother?.email || ""} onChange={(e) => handleChange(e, "mother")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Father Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Father Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" value={form.father?.name || ""} onChange={(e) => handleChange(e, "father")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
            <input name="nic" value={form.father?.nic || ""} onChange={(e) => handleChange(e, "father")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={form.father?.email || ""} onChange={(e) => handleChange(e, "father")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Nominee Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Nominee Info</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" value={form.nominee?.name || ""} onChange={(e) => handleChange(e, "nominee")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
            <input name="nic" value={form.nominee?.nic || ""} onChange={(e) => handleChange(e, "nominee")} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subjects (comma-separated)</label>
        <input
          name="subjects"
          value={form.subjects?.join(", ") || ""}
          onChange={(e) => setForm((prev) => ({ ...prev, subjects: e.target.value.split(",").map((s) => s.trim()) }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Math, Science, English"
        />
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
          Save
        </button>
        <button type="button" onClick={() => navigate(`/admin/students/${id}`)} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  </div>
);

}
