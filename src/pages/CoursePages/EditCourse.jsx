import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('adminToken');

  const [form, setForm] = useState({
    name: '',
    program: '',
    stream: '',
    year: '',
    duration: '6 Months',
    coordinatorEmail: '',
    totalFee: '',
    subjects: []
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [allSubjects, setAllSubjects] = useState([]);

  // Fetch course
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseRes = await axios.get(`${baseURL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const course = courseRes.data.find(c => c.id === courseId);
        if (!course) {
          setError('Course not found');
          return;
        }

        setForm({
          name: course.name || '',
          program: course.program || '',
          stream: course.stream || '',
          year: course.year || '',
          duration: course.duration || '6 Months',
          coordinatorEmail: course.coordinatorEmail || '',
          totalFee: course.totalFee?.toString() || '',
          subjects: course.subjects || []
        });
      } catch (err) {
        setError('Failed to load course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [baseURL, token, courseId]);

  // Fetch subjects when program or stream changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!form.program || (form.program === 'AL' && !form.stream)) {
        setAllSubjects([]);
        return;
      }

      try {
        let query = `program=${form.program}`;
        if (form.program === 'AL') {
          query += `&stream=${form.stream.toLowerCase()}`;
        }

        const res = await axios.get(`${baseURL}/api/subjects?${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllSubjects(res.data);
      } catch (err) {
        console.error('Failed to fetch subjects');
        setAllSubjects([]);
      }
    };

    fetchSubjects();
  }, [form.program, form.stream]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'program' || name === 'stream' ? { subjects: [] } : {})
    }));

    if (name === 'program' && value === 'OL') {
      setForm(prev => ({ ...prev, stream: '', subjects: [] }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        ...form,
        totalFee: parseFloat(form.totalFee),
        program: form.program.toUpperCase(),
        stream: form.program === 'AL' ? form.stream.toLowerCase() : null
      };

      await axios.put(`${baseURL}/api/courses/${courseId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/admin/manage-courses');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update course');
    }
  };

  const showStream = form.program === 'AL';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Course</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleUpdate} className="space-y-4">
        {[
          { label: 'Name', name: 'name' },
          { label: 'Year', name: 'year' },
          { label: 'Coordinator Email', name: 'coordinatorEmail', type: 'email' },
          { label: 'Total Fee (LKR)', name: 'totalFee', type: 'number' },
        ].map(({ label, name, type = 'text' }) => (
          <div key={name}>
            <label className="block font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
        ))}

        {/* Program */}
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

        {/* Stream (if AL) */}
        {showStream && (
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
              {['biology', 'maths', 'art', 'tech', 'commerce'].map((stream) => (
                <option key={stream} value={stream}>
                  {stream.charAt(0).toUpperCase() + stream.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Duration */}
        <div>
          <label className="block font-medium mb-1">Duration</label>
          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-lg"
          >
            <option value="6 Months">6 Months</option>
            <option value="1 Year">1 Year</option>
          </select>
        </div>

        {/* Subjects */}
        <div>
          <label className="block font-medium mb-1">Subjects (up to 10)</label>
          <div className="grid grid-cols-2 gap-2 border rounded-lg p-3 max-h-60 overflow-y-auto">
            {allSubjects.map(subject => (
              <label key={subject.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={subject.id}
                  checked={form.subjects.includes(subject.id)}
                  onChange={(e) => {
                    const { checked, value } = e.target;
                    setForm(prev => {
                      const updatedSubjects = checked
                        ? [...prev.subjects, value]
                        : prev.subjects.filter(id => id !== value);
                      return {
                        ...prev,
                        subjects:
                          updatedSubjects.length <= 10 ? updatedSubjects : prev.subjects
                      };
                    });
                  }}
                />
                <span>{subject.subjectName}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Subjects are filtered by program and stream.
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Update Course
        </button>
      </form>
    </div>
  );
}
