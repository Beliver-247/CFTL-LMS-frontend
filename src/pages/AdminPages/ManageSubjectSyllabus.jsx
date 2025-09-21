import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ManageSubjectSyllabus() {
  const { subjectId } = useParams(); // was courseId
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
        `${baseURL}/api/syllabus/admin/subject/${subjectId}/${month}`, // ✅ admin path
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSyllabus(res.data);
      setMessage("");
    } catch (err) {
      setSyllabus(null);
      setMessage("No syllabus found for this month. You can create one.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, subjectId]);

  // Add Week
  const handleAddWeek = () => {
    const newWeek = {
      weekNumber: syllabus?.weeks?.length + 1 || 1,
      topics: [],
    };
    setSyllabus((prev) => ({
      ...(prev || { subjectId, month, weeks: [] }),
      weeks: [...(prev?.weeks || []), newWeek],
    }));
  };

  const validateSyllabusClient = (s) => {
    if (!s?.subjectId || !s?.month || !Array.isArray(s.weeks)) return false;
    for (const week of s.weeks) {
      if (typeof week.weekNumber !== "number" || !Array.isArray(week.topics)) return false;
      for (const topic of week.topics) {
        if (
          typeof topic.title !== "string" ||
          typeof topic.status !== "string" ||
          !Array.isArray(topic.subtopics || [])
        ) return false;
        for (const sub of topic.subtopics || []) {
          if (typeof sub.title !== "string" || typeof sub.status !== "string") return false;
        }
      }
    }
    return true;
  };

const handleSave = async () => {
  if (!syllabus?.weeks?.length) {
    setMessage("Please add at least one week to the syllabus.");
    return;
  }

  const normalizedWeeks = syllabus.weeks.map((week) => ({
    weekNumber: Number(week.weekNumber),
    topics: (week.topics || []).map((topic) => ({
      title: topic.title || "",
      status: topic.status || "incomplete",
      subtopics: (topic.subtopics || []).map((sub) => ({
        title: sub.title || "",
        status: sub.status || "incomplete",
      })),
    })),
  }));

  try {
    if (syllabus?.id) {
      // ✅ UPDATE: do not send subjectId/month
      await axios.put(
        `${baseURL}/api/syllabus/admin/${syllabus.id}`,
        { weeks: normalizedWeeks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      // ✅ CREATE: send subjectId/month
      await axios.post(
        `${baseURL}/api/syllabus/admin/subject`,
        { subjectId, month, weeks: normalizedWeeks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
      <h1 className="text-3xl font-bold mb-6 text-center">Manage Subject Syllabus</h1>

      <div className="mb-4 flex flex-col md:flex-row items-center gap-4 justify-center">
        <label className="font-semibold text-gray-700">Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
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
                  onClick={() => setSyllabus({ subjectId, month, weeks: [] })}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
                >
                  + Create Syllabus
                </button>
              )}
            </div>
          )}

          {syllabus && (
            <div className="space-y-6 mt-6">
              {(syllabus.weeks || []).map((week, weekIndex) => (
                <div key={weekIndex} className="bg-white p-4 rounded shadow">
                  <h2 className="font-bold text-lg mb-2">Week {week.weekNumber}</h2>

                  {(week.topics || []).map((topic, topicIndex) => (
                    <div key={topicIndex} className="ml-4 mb-4">
                      <input
                        type="text"
                        value={topic.title}
                        onChange={(e) => {
                          const newTitle = e.target.value;
                          setSyllabus((prev) => {
                            const copy = structuredClone(prev);
                            copy.weeks[weekIndex].topics[topicIndex].title = newTitle;
                            return copy;
                          });
                        }}
                        placeholder="Topic Title"
                        className="border px-2 py-1 w-full mb-1"
                      />
                      <ul className="ml-4">
                        {(topic.subtopics || []).map((sub, subIndex) => (
                          <li key={subIndex}>
                            <input
                              type="text"
                              value={sub.title}
                              onChange={(e) => {
                                const newVal = e.target.value;
                                setSyllabus((prev) => {
                                  const copy = structuredClone(prev);
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
                          onClick={() => {
                            setSyllabus((prev) => {
                              const copy = structuredClone(prev);
                              copy.weeks[weekIndex].topics[topicIndex].subtopics =
                                copy.weeks[weekIndex].topics[topicIndex].subtopics || [];
                              copy.weeks[weekIndex].topics[topicIndex].subtopics.push({
                                title: "",
                                status: "incomplete",
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
                    onClick={() => {
                      setSyllabus((prev) => {
                        const copy = structuredClone(prev);
                        copy.weeks[weekIndex].topics = copy.weeks[weekIndex].topics || [];
                        copy.weeks[weekIndex].topics.push({
                          title: "",
                          status: "incomplete",
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
