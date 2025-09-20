import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api"

export default function CreateSubject() {
  const [form, setForm] = useState({
    subjectName: "",
    program: "",
    stream: "",
    isMandatory: false, // Only for OL
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // If program becomes OL, clear stream and keep isMandatory visible
    if (name === "program" && value === "OL") {
      setForm((prev) => ({ ...prev, stream: "" }));
    }
    // If program becomes AL, clear isMandatory (not used)
    if (name === "program" && value === "AL") {
      setForm((prev) => ({ ...prev, isMandatory: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = {
        subjectName: form.subjectName.trim(),
        program: form.program.trim().toUpperCase(),
      };

      if (!payload.subjectName || !payload.program) {
        setError("Subject name and program are required.");
        return;
      }

      if (payload.program === "AL") {
        if (!form.stream) {
          setError("Stream is required for AL.");
          return;
        }
        payload.stream = form.stream.trim().toLowerCase();
      } else {
        // OL
        payload.isMandatory = !!form.isMandatory; // backend supports this
      }

      await api.post(`/api/subjects`, payload);

      setSuccess("Subject created successfully!");
      setForm({ subjectName: "", program: "", stream: "", isMandatory: false });

      // Optional redirect
      // navigate("/admin/subjects");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create subject");
    }
  };

  const showStream = form.program === "AL";
  const showIsMandatory = form.program === "OL";

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

        {showStream && (
          <div>
            <label className="block font-medium mb-1">Stream (AL)</label>
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

        {showIsMandatory && (
          <div className="flex items-center gap-2">
            <input
              id="isMandatory"
              type="checkbox"
              name="isMandatory"
              checked={form.isMandatory}
              onChange={handleChange}
            />
            <label htmlFor="isMandatory" className="font-medium">
              Mandatory subject (OL)
            </label>
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
