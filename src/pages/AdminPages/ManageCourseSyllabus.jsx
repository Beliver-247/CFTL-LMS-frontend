import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ManageCourseSyllabus() {
  const { courseId } = useParams();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("adminToken");

  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [syllabus, setSyllabus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSyllabus = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/syllabus/${courseId}/${month}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSyllabus(res.data);
      setMessage("");
    } catch (err) {
      setSyllabus(null); // No syllabus found
      setMessage("No syllabus found for this month. You can create one.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, [month]);
// Adding a new week
const handleAddWeek = () => {
  const newWeek = {
    weekNumber: syllabus?.weeks.length + 1 || 1,
    topics: [], // ✅ Keep empty but valid
  };
  setSyllabus(prev => ({
    ...prev,
    weeks: [...(prev?.weeks || []), newWeek],
  }));
};


const handleSave = async () => {
  if (!syllabus?.weeks?.length) {
    setMessage("Please add at least one week to the syllabus.");
    return;
  }

  const validateSyllabusClient = (syllabus) => {
    if (!syllabus.courseId || !syllabus.month || !Array.isArray(syllabus.weeks)) return false;
    for (const week of syllabus.weeks) {
      if (typeof week.weekNumber !== "number" || !Array.isArray(week.topics)) return false;
      for (const topic of week.topics) {
        if (typeof topic.title !== "string" || typeof topic.status !== "string" || !Array.isArray(topic.subtopics)) return false;
        for (const sub of topic.subtopics) {
          if (typeof sub.title !== "string" || typeof sub.status !== "string") return false;
        }
      }
    }
    return true;
  };

  if (!validateSyllabusClient(syllabus)) {
    setMessage("Invalid syllabus structure. Ensure all fields are filled correctly.");
    return;
  }

  try {
    const normalizedWeeks = syllabus.weeks.map(week => ({
      weekNumber: week.weekNumber,
      topics: week.topics.map(topic => ({
        title: topic.title || "",
        status: topic.status || "incomplete",
        subtopics: (topic.subtopics || []).map(sub => ({
          title: sub.title || "",
          status: sub.status || "incomplete",
        })),
      })),
    }));

    const payload = {
      courseId,
      month,
      weeks: normalizedWeeks,
    };

    console.log("Normalized payload:", payload);

    if (syllabus?.id) {
      await axios.put(`${baseURL}/api/syllabus/${syllabus.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post(`${baseURL}/api/syllabus`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setMessage("Syllabus saved successfully!");
    fetchSyllabus();
  } catch (err) {
    console.error("Error saving syllabus:", err.response?.data || err.message);
    setMessage(`Failed to save syllabus: ${err.response?.data?.error || err.message}`);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Syllabus</h1>

      <div className="mb-4 flex flex-col md:flex-row items-center gap-4 justify-center">
        <label className="font-semibold text-gray-700">Month:</label>
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border rounded px-4 py-2"
        />
        <button
          onClick={fetchSyllabus}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load
        </button>
      </div>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <>
          {message && (
  <div className="text-center mt-6 space-y-4">
    <p className="text-sm text-gray-600">{message}</p>
    {!syllabus && (
      <button
        onClick={() =>
          setSyllabus({ courseId, month, weeks: [] })
        }
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        + Create Syllabus
      </button>
    )}
  </div>
)}


          {syllabus && (
            <div className="space-y-6 mt-6">
              {syllabus.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="bg-white p-4 rounded shadow">
                  <h2 className="font-bold text-lg mb-2">
                    Week {week.weekNumber}
                  </h2>
                  {week.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="ml-4 mb-4">
                      <input
                        type="text"
                        value={topic.title}
                        onChange={e => {
                          const newTitle = e.target.value;
                          setSyllabus(prev => {
                            const copy = { ...prev };
                            copy.weeks[weekIndex].topics[topicIndex].title = newTitle;
                            return copy;
                          });
                        }}
                        placeholder="Topic Title"
                        className="border px-2 py-1 w-full mb-1"
                      />
                      <ul className="ml-4">
                        {topic.subtopics.map((sub, subIndex) => (
                          <li key={subIndex}>
                            <input
                              type="text"
                              value={sub.title}
                              onChange={e => {
                                const newVal = e.target.value;
                                setSyllabus(prev => {
                                  const copy = { ...prev };
                                  copy.weeks[weekIndex].topics[topicIndex].subtopics[subIndex].title = newVal;
                                  return copy;
                                });
                              }}
                              placeholder="Subtopic"
                              className="border px-2 py-1 my-1 w-full"
                            />
                          </li>
                        ))}
                        <button
                          className="text-sm text-blue-600"
// Adding a new subtopic
onClick={() => {
  setSyllabus(prev => {
    const copy = { ...prev };
    copy.weeks[weekIndex].topics[topicIndex].subtopics.push({
      title: "",
      status: "incomplete", // ✅ Add default status
    });
    return copy;
  });
}}

                        >
                          + Add Subtopic
                        </button>
                      </ul>
                    </div>
                  ))}
                  <button
                    className="text-sm text-green-600 mt-2"
// Adding a new topic
onClick={() => {
  setSyllabus(prev => {
    const copy = { ...prev };
    copy.weeks[weekIndex].topics.push({
      title: "",
      status: "incomplete", // ✅ Add default status
      subtopics: [],
    });
    return copy;
  });
}}

                  >
                    + Add Topic
                  </button>
                </div>
              ))}
              <button
                onClick={handleAddWeek}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                + Add Week
              </button>
              <div className="text-center mt-6">
                <button
                  onClick={handleSave}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Save Syllabus
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
