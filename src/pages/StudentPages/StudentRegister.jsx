// src/components/StudentRegister.jsx
import { useState, useEffect, useMemo } from "react";
import api from "../../api"; // <-- adjust path if needed
import BasicInformation from "./StudentRegistration/BasicInformation";
import ParentsDetails from "./StudentRegistration/ParentsDetails";
import GuardianAndOtherDetails from "./StudentRegistration/GuardianAndOtherDetails";
import EnrollToCourse from "./StudentRegistration/EnrollToCourse";

const initialFormState = {
  registrationDate: new Date().toISOString().slice(0, 10),

  // --- Step 1: Basic info ---
  nameFull: "",
  nameInitials: "",
  dob: "",
  religion: "Buddhism",
  nic: "",
  address: "",
  telephone: "",
  previousSchool: "",
  medical: "",

  // --- Step 2: Parents ---
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

  // --- Step 3: Guardian/Nominee ---
  nominee: {
    name: "",
    address: "",
    mobile: "",
    nic: "",
  },

  // --- Step 4: Enrollment preferences (not actual enrollment) ---
  courseId: "",
  stream: "",
  selectedSubjects: [],
};

const isValidNIC = (nic) => /^[0-9]{9}[vV]$|^[0-9]{12}$/.test(nic);
const isValidPhone = (phone) => /^[0-9]{10}$/.test(phone);

export default function StudentRegister() {
  const [form, setForm] = useState(initialFormState);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [subjectNamesMap, setSubjectNamesMap] = useState({}); // id -> subjectName
  const [fetchError, setFetchError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent leaving the page mid-submit
  useEffect(() => {
    const handler = (e) => {
      if (isSubmitting) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isSubmitting]);

  // Load courses (public) + subject names (auth-only; ignore errors if unauthorized)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const coursesRes = await api.get(`/api/courses`);
        setCourses(coursesRes.data || []);
      } catch {
        setFetchError("Failed to load courses. Please refresh the page.");
      }

      // Best-effort: build id->name map for nicer rendering in step 4
      try {
        const subjectsRes = await api.get(`/api/subjects/public`);
        const map = {};
        (subjectsRes.data || []).forEach((s) => {
          map[s.id] = s.subjectName;
        });
        setSubjectNamesMap(map);
      } catch {
        // Not logged in as admin/coordinator → just show IDs in the UI; no hard error.
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name.includes("nic")) newValue = value.replace(/[^0-9vV]/g, "").slice(0, 12);
    else if (name === "telephone" || name === "mobile") newValue = value.replace(/[^0-9]/g, "").slice(0, 10);

    if (section) {
      setForm((prev) => ({
        ...prev,
        [section]: { ...prev[section], [name]: newValue },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: newValue }));
    }

    const newErrors = { ...errors };
    const key = `${section ? `${section}.` : ""}${name}`;

    if (name.includes("nic")) {
      if (newValue && !isValidNIC(newValue)) newErrors[key] = "Invalid NIC format";
      else delete newErrors[key];
    }

    if (name === "telephone" || name === "mobile") {
      if (newValue && !isValidPhone(newValue)) newErrors[key] = "Must be 10 digits";
      else delete newErrors[key];
    }

    setErrors(newErrors);
  };

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === form.courseId),
    [courses, form.courseId]
  );

  // Strict validation for Step 4 to prevent premature submits
  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!form.nameFull) newErrors.nameFull = "Full name is required";
      if (!form.nameInitials) newErrors.nameInitials = "Name with initials is required";
      if (!form.dob) newErrors.dob = "Date of birth is required";
      if (!form.address) newErrors.address = "Address is required";
      if (!form.telephone) newErrors.telephone = "Telephone is required";
      if (form.nic && !isValidNIC(form.nic)) newErrors.nic = "Invalid NIC format";
      if (form.telephone && !isValidPhone(form.telephone)) newErrors.telephone = "Telephone must be 10 digits";
    } else if (currentStep === 2) {
      if (!form.mother.name) newErrors["mother.name"] = "Mother's name is required";
      if (!form.mother.occupation) newErrors["mother.occupation"] = "Mother's occupation is required";
      if (!form.mother.mobile) newErrors["mother.mobile"] = "Mother's mobile is required";
      if (!form.mother.nic) newErrors["mother.nic"] = "Mother's NIC is required";
      if (form.mother.nic && !isValidNIC(form.mother.nic)) newErrors["mother.nic"] = "Invalid NIC format";
      if (form.mother.mobile && !isValidPhone(form.mother.mobile)) newErrors["mother.mobile"] = "Mother's mobile must be 10 digits";

      if (!form.father.name) newErrors["father.name"] = "Father's name is required";
      if (!form.father.occupation) newErrors["father.occupation"] = "Father's occupation is required";
      if (!form.father.mobile) newErrors["father.mobile"] = "Father's mobile is required";
      if (!form.father.nic) newErrors["father.nic"] = "Father's NIC is required";
      if (form.father.nic && !isValidNIC(form.father.nic)) newErrors["father.nic"] = "Invalid NIC format";
      if (form.father.mobile && !isValidPhone(form.father.mobile)) newErrors["father.mobile"] = "Father's mobile must be 10 digits";
    } else if (currentStep === 3) {
      if (!form.nominee.name) newErrors["nominee.name"] = "Nominee name is required";
      if (!form.nominee.address) newErrors["nominee.address"] = "Nominee address is required";
      if (!form.nominee.mobile) newErrors["nominee.mobile"] = "Nominee mobile is required";
      if (!form.nominee.nic) newErrors["nominee.nic"] = "Nominee NIC is required";
      if (form.nominee.nic && !isValidNIC(form.nominee.nic)) newErrors["nominee.nic"] = "Invalid NIC format";
      if (form.nominee.mobile && !isValidPhone(form.nominee.mobile)) newErrors["nominee.mobile"] = "Nominee's mobile must be 10 digits";
    } else if (currentStep === 4) {
      if (!form.courseId) newErrors.courseId = "Please select a course";

      if (selectedCourse?.program === "AL") {
        if (!form.stream) newErrors.stream = "Please select a stream";
        if ((form.selectedSubjects || []).length !== 3) {
          newErrors.selectedSubjects = "Please choose exactly 3 subjects";
        }
      }

      if (selectedCourse?.program === "OL") {
        const count = (form.selectedSubjects || []).length;
        if (count < 1) newErrors.selectedSubjects = "Please choose at least 1 optional subject";
        if (count > 4) newErrors.selectedSubjects = "You can select up to 4 optional subjects";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isEnrollmentValid = useMemo(() => {
    if (!form.courseId || !selectedCourse) return false;
    if (selectedCourse.program === "AL") {
      return !!form.stream && (form.selectedSubjects?.length === 3);
    }
    if (selectedCourse.program === "OL") {
      const count = form.selectedSubjects?.length || 0;
      return count >= 1 && count <= 4;
    }
    return false;
  }, [form.courseId, form.stream, form.selectedSubjects, selectedCourse]);

  const handleNext = () => {
    if (validateStep()) setCurrentStep((prev) => prev + 1);
  };

  const handlePrevious = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // hard guard
    if (!validateStep()) return;

    const studentData = {
      nameFull: form.nameFull,
      nameInitials: form.nameInitials,
      dob: form.dob,
      religion: form.religion,
      nic: form.nic,
      address: form.address,
      telephone: form.telephone,
      previousSchool: form.previousSchool,
      medical: form.medical,
      mother: form.mother,
      father: form.father,
      nominee: form.nominee,
    };

    setIsSubmitting(true);
    try {
      const res = await api.post(`/api/students`, {
        ...studentData,
        enrollmentPreferences: {
          courseId: form.courseId,
          stream: selectedCourse?.program === "AL" ? form.stream : null,
          subjects: form.selectedSubjects,
        },
      });

      const { registrationNo } = res.data;
      setSuccess(
        `Student registered successfully! Reg No: ${registrationNo}. A staff member will finalize the enrollment.`
      );
      setForm(initialFormState);
      setCurrentStep(1);
      setErrors({});
    } catch (err) {
      setErrors({
        submit: err?.response?.data?.error || "An unexpected error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = ["Basic Info", "Parents", "Guardian", "Enrollment"];
    return (
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center">
            <div
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
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

        <form
          onSubmit={handleSubmit}
          className="space-y-6 relative"
          onKeyDown={(e) => {
            // Prevent accidental Enter key submit on step 4 when invalid
            if (e.key === "Enter" && currentStep === 4 && !isEnrollmentValid) {
              e.preventDefault();
            }
          }}
        >
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] pointer-events-none rounded-lg" />
          )}

          {currentStep === 1 && (
            <BasicInformation form={form} handleChange={handleChange} errors={errors} />
          )}

          {currentStep === 2 && (
            <ParentsDetails form={form} handleChange={handleChange} errors={errors} />
          )}

          {currentStep === 3 && (
            <GuardianAndOtherDetails form={form} handleChange={handleChange} errors={errors} />
          )}

          {currentStep === 4 && (
            <EnrollToCourse
              form={form}
              setForm={setForm}
              errors={errors}
              courses={courses}
              subjectNamesMap={subjectNamesMap}
            />
          )}

          <div className="flex justify-between mt-6 pt-4 border-t">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                disabled={isSubmitting}
                className={`px-6 py-3 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSubmitting
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 hover:bg-gray-600 focus:ring-gray-500"
                }`}
              >
                Previous
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
                className={`px-6 py-3 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  isSubmitting
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isEnrollmentValid || isSubmitting}
                aria-disabled={!isEnrollmentValid || isSubmitting}
                title={
                  !isEnrollmentValid
                    ? "Complete enrollment selections to enable submission"
                    : "Register Student"
                }
                className={`px-6 py-3 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  !isEnrollmentValid || isSubmitting
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? "Registering…" : "Register Student"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
