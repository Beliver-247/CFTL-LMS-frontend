import { useState, useEffect } from "react";
import axios from "axios";
import BasicInformation from "./StudentRegistration/BasicInformation";
import ParentsDetails from "./StudentRegistration/ParentsDetails";
import GuardianAndOtherDetails from "./StudentRegistration/GuardianAndOtherDetails";

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
      newErrors[`${section ? `${section}.` : ""}${name}`] =
        `Invalid NIC format`;
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
        `Student registered successfully! Assigned Reg No: ${registrationNo}`,
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
            <BasicInformation
              form={form}
              handleChange={handleChange}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <ParentsDetails
              form={form}
              handleChange={handleChange}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <GuardianAndOtherDetails
              form={form}
              handleChange={handleChange}
              errors={errors}
            />
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
