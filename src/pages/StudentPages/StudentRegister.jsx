import { useState, useEffect } from "react";
import axios from "axios";

const initialFormState = {
  registrationNo: "",
  registrationDate: "",
  registrationFee: "",
  monthlyFee: "",
  preBudget: "",
  totalAmount: "",
  nameFull: "",
  nameInitials: "",
  dob: "",
  religion: "Buddhism",
  nic: "",
  address: "",
  telephone: "",
  mother: {
    name: "",
    occupation: "",
    workplaceAddress: "",
    mobile: "",
    nic: "",
    email: "",
  },
  father: {
    name: "",
    occupation: "",
    workplaceAddress: "",
    mobile: "",
    nic: "",
    email: "",
  },
  previousSchool: "",
  subjects: "",
  nominee: {
    name: "",
    address: "",
    mobile: "",
    nic: "",
  },
  medical: "",
};

export default function StudentRegister() {
  const [form, setForm] = useState(initialFormState);
  const [latestRegNo, setLatestRegNo] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchLatestRegNo = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/students/latest-regno"
        );
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

        setLatestRegNo(res.data.registrationNo);
        setForm((prev) => ({
          ...prev,
          registrationNo: res.data.registrationNo,
          registrationDate: today,
        }));
      } catch (err) {
        console.error("Failed to fetch latest registration number");
      }
    };

    fetchLatestRegNo();
  }, []);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const dataToSend = {
      ...form,
      registrationNo: undefined, // Let backend handle
      registrationDate: undefined, // Let backend handle
      registrationFee: parseFloat(form.registrationFee),
      monthlyFee: parseFloat(form.monthlyFee),
      preBudget: parseFloat(form.preBudget),
      totalAmount: parseFloat(form.totalAmount),
      subjects: form.subjects.split(",").map((s) => s.trim()),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/students",
        dataToSend
      );
      const { registrationNo, registrationDate } = response.data;

      setSuccess(
        `Student registered successfully! Assigned Reg No: ${registrationNo}`
      );
      setForm({
        ...initialFormState,
        registrationNo,
        registrationDate: registrationDate?.slice(0, 10),
      });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Student Registration
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestRegNo && (
                <p className="text-sm text-gray-500 mb-1 md:col-span-2">
                  Last registration number: <strong>{latestRegNo}</strong>
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration No
                </label>
                <input
                  type="text"
                  name="registrationNo"
                  value={form.registrationNo}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Date
                </label>
                <input
                  type="date"
                  name="registrationDate"
                  value={form.registrationDate}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md shadow-sm focus:outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Fee (LKR)
                </label>
                <input
                  type="number"
                  name="registrationFee"
                  value={form.registrationFee}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Fee (LKR)
                </label>
                <input
                  type="number"
                  name="monthlyFee"
                  value={form.monthlyFee}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pre Budget (LKR)
                </label>
                <input
                  type="number"
                  name="preBudget"
                  value={form.preBudget}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount (LKR)
                </label>
                <input
                  type="number"
                  name="totalAmount"
                  value={form.totalAmount}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name in FULL (BLOCK LETTERS)
                </label>
                <input
                  type="text"
                  name="nameFull"
                  value={form.nameFull}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name with Initials
                </label>
                <input
                  type="text"
                  name="nameInitials"
                  value={form.nameInitials}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  max={new Date().toISOString().slice(0, 10)} // restrict max date to today
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Religion
                </label>
                <select
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Buddhism">Buddhism</option>
                  <option value="Catholicism">Catholicism</option>
                  <option value="Islam">Islam</option>
                  <option value="Hindu">Hindu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC (optional)
                </label>
                <input
                  type="text"
                  name="nic"
                  value={form.nic}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permanent Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone
                </label>
                <input
                  type="text"
                  name="telephone"
                  value={form.telephone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d{0,10}$/.test(value)) {
                      handleChange(e);
                    }
                  }}
                  maxLength={10}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Mother's Details Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Mother's Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.mother.name}
                  onChange={(e) => handleChange(e, "mother")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={form.mother.occupation}
                  onChange={(e) => handleChange(e, "mother")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Address
                </label>
                <input
                  type="text"
                  name="workplaceAddress"
                  value={form.mother.workplaceAddress}
                  onChange={(e) => handleChange(e, "mother")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.mother.mobile}
                  onChange={(e) => handleChange(e, "mother")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC
                </label>
                <input
                  type="text"
                  name="nic"
                  value={form.mother.nic}
                  onChange={(e) => handleChange(e, "mother")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.mother.email}
                  onChange={(e) => handleChange(e, "mother")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Father's Details Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Father's Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.father.name}
                  onChange={(e) => handleChange(e, "father")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={form.father.occupation}
                  onChange={(e) => handleChange(e, "father")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Address
                </label>
                <input
                  type="text"
                  name="workplaceAddress"
                  value={form.father.workplaceAddress}
                  onChange={(e) => handleChange(e, "father")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.father.mobile}
                  onChange={(e) => handleChange(e, "father")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC
                </label>
                <input
                  type="text"
                  name="nic"
                  value={form.father.nic}
                  onChange={(e) => handleChange(e, "father")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.father.email}
                  onChange={(e) => handleChange(e, "father")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Previous School Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Previous School
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                name="previousSchool"
                value={form.previousSchool}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Subjects Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Subjects
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subjects (comma separated)
              </label>
              <input
                type="text"
                name="subjects"
                value={form.subjects}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Mathematics, Science, English"
              />
            </div>
          </div>

          {/* Nominee Details Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Nominee Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.nominee.name}
                  onChange={(e) => handleChange(e, "nominee")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.nominee.address}
                  onChange={(e) => handleChange(e, "nominee")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={form.nominee.mobile}
                  onChange={(e) => handleChange(e, "nominee")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIC
                </label>
                <input
                  type="text"
                  name="nic"
                  value={form.nominee.nic}
                  onChange={(e) => handleChange(e, "nominee")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Medical Info Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">
              Medical Information
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medications / Illness
              </label>
              <textarea
                name="medical"
                value={form.medical}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Register Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
