import { useState, useEffect } from "react";
import axios from "axios";
import { getFreshToken } from "../../utils/authToken";

export default function AdminSetRole() {
  const [admins, setAdmins] = useState([]);
  const [error, setError] = useState("");
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchAdmins = async () => {
      const token = await getFreshToken();
      try {
        const res = await axios.get(`${baseURL}/api/admins/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(res.data);
      } catch (err) {
        setError("Failed to load admins");
      }
    };

    fetchAdmins();
  }, []);

  const updateRole = async (id, newRole) => {
    const token = await getFreshToken();
    try {
      await axios.put(
        `${baseURL}/api/admins/${id}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins((prev) =>
        prev.map((admin) => (admin.id === id ? { ...admin, role: newRole } : admin))
      );
    } catch (err) {
      alert("Failed to update role");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Set Admin Roles</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left px-4 py-2">Name</th>
            <th className="text-left px-4 py-2">Email</th>
            <th className="text-left px-4 py-2">Current Role</th>
            <th className="text-left px-4 py-2">Set Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="border-t">
              <td className="px-4 py-2">{admin.fullName}</td>
              <td className="px-4 py-2">{admin.email}</td>
              <td className="px-4 py-2">{admin.role}</td>
              <td className="px-4 py-2">
                <select
                  value={admin.role}
                  onChange={(e) => updateRole(admin.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="admin">Admin</option>
                  <option value="coordinator">Coordinator</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
