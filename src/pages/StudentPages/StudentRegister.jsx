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

const isValidNIC = (nic) => /^[0-9]{9}[vV]$|^[0-9]{12}$/.test(nic);
const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

export default function StudentRegister() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const [form, setForm] = useState(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchLatestRegNo = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/students/latest-regno`);
        const today = new Date().toISOString().slice(0, 10);
        setForm((prev) => ({
          ...prev,
          registrationDate: today,
        }));
      } catch {
        setFetchError("Failed to fetch latest registration number");
      }
    };
    fetchLatestRegNo();
  }, []);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    let newValue = value;

    // Restrict NIC to 12 characters (numeric or v/V)
    if (name.includes("nic")) {
      newValue = value.replace(/[^0-9vV]/g, "").slice(0, 12);
    }
    // Restrict phone to 10 digits
    else if (name === "telephone" || name === "mobile") {
      newValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: newValue,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }

    // Real-time validation
    const newErrors = { ...errors };
    if (name.includes("nic") && newValue && !isValidNIC(newValue)) {
      newErrors[
        `${section ? `${section}.` : ""}${name}`
      ] = `Invalid NIC format`;
    } else {
      delete newErrors[`${section ? `${section}.` : ""}${name}`];
    }
    if (
      (name === "telephone" || name === "mobile") &&
      newValue &&
      !isValidPhone(newValue)
    ) {
      newErrors[`${section ? `${section}.` : ""}${name}`] = `Must be 10 digits`;
    } else {
      delete newErrors[`${section ? `${section}.` : ""}${name}`];
    }
    setErrors(newErrors);
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!form.nameFull) newErrors.nameFull = "Full name is required";
      if (!form.nameInitials)
        newErrors.nameInitials = "Name with initials is required";
      if (!form.dob) newErrors.dob = "Date of birth is required";
      if (!form.address) newErrors.address = "Address is required";
      if (!form.telephone) newErrors.telephone = "Telephone is required";
      if (!form.registrationFee)
        newErrors.registrationFee = "Registration fee is required";
      if (!form.monthlyFee) newErrors.monthlyFee = "Monthly fee is required";
      if (!form.preBudget) newErrors.preBudget = "Pre-budget is required";
      if (!form.totalAmount) newErrors.totalAmount = "Total amount is required";
      if (form.nic && !isValidNIC(form.nic))
        newErrors.nic = "Invalid NIC format";
      if (form.telephone && !isValidPhone(form.telephone))
        newErrors.telephone = "Telephone must be 10 digits";
    } else if (currentStep === 2) {
      if (!form.mother.name)
        newErrors["mother.name"] = "Mother's name is required";
      if (!form.mother.occupation)
        newErrors["mother.occupation"] = "Mother's occupation is required";
      if (!form.mother.mobile)
        newErrors["mother.mobile"] = "Mother's mobile is required";
      if (!form.mother.nic)
        newErrors["mother.nic"] = "Mother's NIC is required";
      if (form.mother.nic && !isValidNIC(form.mother.nic))
        newErrors["mother.nic"] = "Invalid NIC format";
      if (form.mother.mobile && !isValidPhone(form.mother.mobile))
        newErrors["mother.mobile"] = "Mother's mobile must be 10 digits";
      if (!form.father.name)
        newErrors["father.name"] = "Father's name is required";
      if (!form.father.occupation)
        newErrors["father.occupation"] = "Father's occupation is required";
      if (!form.father.mobile)
        newErrors["father.mobile"] = "Father's mobile is required";
      if (!form.father.nic)
        newErrors["father.nic"] = "Father's NIC is required";
      if (form.father.nic && !isValidNIC(form.father.nic))
        newErrors["father.nic"] = "Invalid NIC format";
      if (form.father.mobile && !isValidPhone(form.father.mobile))
        newErrors["father.mobile"] = "Father's mobile must be 10 digits";
    } else if (currentStep === 3) {
      if (!form.nominee.name)
        newErrors["nominee.name"] = "Nominee name is required";
      if (!form.nominee.address)
        newErrors["nominee.address"] = "Nominee address is required";
      if (!form.nominee.mobile)
        newErrors["nominee.mobile"] = "Nominee mobile is required";
      if (!form.nominee.nic)
        newErrors["nominee.nic"] = "Nominee NIC is required";
      if (form.nominee.nic && !isValidNIC(form.nominee.nic))
        newErrors["nominee.nic"] = "Invalid NIC format";
      if (form.nominee.mobile && !isValidPhone(form.nominee.mobile))
        newErrors["nominee.mobile"] = "Nominee's mobile must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    const dataToSend = {
      ...form,
      registrationNo: undefined,
      registrationDate: undefined,
      registrationFee: parseFloat(form.registrationFee),
      monthlyFee: parseFloat(form.monthlyFee),
      preBudget: parseFloat(form.preBudget),
      totalAmount: parseFloat(form.totalAmount),
      subjects: form.subjects.split(",").map((s) => s.trim()),
    };

    try {
      const response = await axios.post(`${baseURL}/api/students`, dataToSend);
      const { registrationNo, registrationDate } = response.data;
      setSuccess(
        `Student registered successfully! Assigned Reg No: ${registrationNo}`
      );
      setForm(initialFormState);
      setCurrentStep(1);
      setErrors({});
    } catch (err) {
      setErrors({
        submit: err.response?.data?.error || "Something went wrong.",
      });
    }
  };

  const renderStepIndicator = () => {
    const steps = ["Basic Information", "Parents' Details", "Guardian & Other"];
    return (
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`inline-block w-8 h-8 rounded-full ${
                currentStep === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {index + 1}
            </div>
            <p className="text-sm mt-2">{step}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
          Student Registration
        </h2>

        {fetchError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {fetchError}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-md">
                    To be assigned upon submission
                  </p>
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
                  {errors.registrationFee && (
                    <p className="text-red-500 text-sm">
                      {errors.registrationFee}
                    </p>
                  )}
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
                  {errors.monthlyFee && (
                    <p className="text-red-500 text-sm">{errors.monthlyFee}</p>
                  )}
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
                  {errors.preBudget && (
                    <p className="text-red-500 text-sm">{errors.preBudget}</p>
                  )}
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
                  {errors.totalAmount && (
                    <p className="text-red-500 text-sm">{errors.totalAmount}</p>
                  )}
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
                  {errors.nameFull && (
                    <p className="text-red-500 text-sm">{errors.nameFull}</p>
                  )}
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
                  {errors.nameInitials && (
                    <p className="text-red-500 text-sm">
                      {errors.nameInitials}
                    </p>
                  )}
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
                    max={new Date().toISOString().slice(0, 10)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm">{errors.dob}</p>
                  )}
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
                    <option value="Other">Other</option>
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
                    maxLength={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.nic && (
                    <p className="text-red-500 text-sm">{errors.nic}</p>
                  )}
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
                  {errors.address && (
                    <p className="text-red-500 text-sm">{errors.address}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telephone
                  </label>
                  <input
                    type="text"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    maxLength={10}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.telephone && (
                    <p className="text-red-500 text-sm">{errors.telephone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Previous School
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={form.previousSchool}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
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
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Parents' Details
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Mother's Details
                  </h4>
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
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["mother.name"] && (
                        <p className="text-red-500 text-sm">
                          {errors["mother.name"]}
                        </p>
                      )}
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
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["mother.occupation"] && (
                        <p className="text-red-500 text-sm">
                          {errors["mother.occupation"]}
                        </p>
                      )}
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
                        maxLength={10}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["mother.mobile"] && (
                        <p className="text-red-500 text-sm">
                          {errors["mother.mobile"]}
                        </p>
                      )}
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
                        maxLength={12}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["mother.nic"] && (
                        <p className="text-red-500 text-sm">
                          {errors["mother.nic"]}
                        </p>
                      )}
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
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Father's Details
                  </h4>
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
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["father.name"] && (
                        <p className="text-red-500 text-sm">
                          {errors["father.name"]}
                        </p>
                      )}
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
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["father.occupation"] && (
                        <p className="text-red-500 text-sm">
                          {errors["father.occupation"]}
                        </p>
                      )}
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
                        maxLength={10}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["father.mobile"] && (
                        <p className="text-red-500 text-sm">
                          {errors["father.mobile"]}
                        </p>
                      )}
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
                        maxLength={12}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["father.nic"] && (
                        <p className="text-red-500 text-sm">
                          {errors["father.nic"]}
                        </p>
                      )}
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
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-4">
                Guardian & Other Details
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Guardian Details
                  </h4>
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
                        maxLength={10}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["nominee.mobile"] && (
                        <p className="text-red-500 text-sm">
                          {errors["nominee.mobile"]}
                        </p>
                      )}
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
                        maxLength={12}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors["nominee.nic"] && (
                        <p className="text-red-500 text-sm">
                          {errors["nominee.nic"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-700 mb-2">
                    Medical Information
                  </h4>
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
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-500 text-white font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Student
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
