import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function UpdateStartingMonthsModal({ onClose }) {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [monthData, setMonthData] = useState({
    OL_6month: [],
    OL_1year: [],
    AL_6month: [],
    AL_1year: [],
  });

  const [newValues, setNewValues] = useState({ ...monthData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    axios
      .get(`${baseURL}/api/registration-requests/starting-months`)
      .then((res) => {
        setMonthData(res.data);
        setNewValues(res.data);
      })
      .catch(() => setError("Failed to fetch starting months."));
  }, [baseURL]);

  const handleChange = (key, index, value) => {
    const updated = [...newValues[key]];
    updated[index] = value;
    setNewValues({ ...newValues, [key]: updated });
  };

  const handleAdd = (key) => {
    setNewValues({ ...newValues, [key]: [...newValues[key], ""] });
  };

  const handleRemove = (key, index) => {
    const updated = [...newValues[key]];
    updated.splice(index, 1);
    setNewValues({ ...newValues, [key]: updated });
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      await axios.put(
        `${baseURL}/api/registration-requests/starting-months`,
        newValues
      );
      setSuccessMsg("Starting months updated successfully.");
      setMonthData(newValues);
    } catch (err) {
      setError("Failed to update starting months.");
    } finally {
      setSaving(false);
    }
  };

  const categoryLabels = {
    OL_6month: "OL - 6 Month",
    OL_1year: "OL - 1 Year",
    AL_6month: "AL - 6 Month",
    AL_1year: "AL - 1 Year",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white p-6 rounded-lg max-w-2xl w-full shadow-xl overflow-y-auto max-h-[90vh]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-red-800">
          Update Starting Months
        </h2>

        {Object.keys(newValues).map((key) => (
          <div key={key} className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">
              {categoryLabels[key]}
            </h3>
            {newValues[key].map((month, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={month}
                  onChange={(e) => handleChange(key, index, e.target.value)}
                  className="border p-2 rounded w-full text-black"
                  placeholder="Enter month"
                />

                <button
                  type="button"
                  onClick={() => handleRemove(key, index)}
                  className="ml-2 text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAdd(key)}
              className="text-sm text-blue-700 hover:underline"
            >
              + Add Month
            </button>
          </div>
        ))}

        {error && <div className="text-red-600 mb-2">{error}</div>}
        {successMsg && <div className="text-green-600 mb-2">{successMsg}</div>}

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
