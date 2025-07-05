import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

export default function AdminProfileForm() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [form, setForm] = useState({
    fullName: "",
    nameInitials: "",
    telephone: "",
    altTelephone: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkInviteAndRedirect = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/admin-login");
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/api/admins/check-invite`, {
          params: { email: user.email },
        });

        // ✅ Allowed — they are invited
      } catch (err) {
        // ❌ Not invited — sign them out and redirect
        await auth.signOut();
        localStorage.removeItem("adminToken");
        navigate("/admin-login");
      }
    };

    checkInviteAndRedirect();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      await axios.post(`${baseURL}/api/admins`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Profile creation failed");
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
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              setForm({ ...form, telephone: value });
            }
          }}
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="altTelephone"
          placeholder="Alternative Telephone (optional)"
          value={form.altTelephone}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d{0,10}$/.test(value)) {
              setForm({ ...form, altTelephone: value });
            }
          }}
          className="w-full border px-3 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
