import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { auth, RecaptchaVerifier } from '../firebase';
import { signInWithPhoneNumber } from 'firebase/auth';

export default function RegistrationRequestModal({ onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    program: 'OL',
    stream: '',
    year: '',
    duration: '6 month',
    startingMonth: ''
  });

  const [months, setMonths] = useState([]);
  const [streamsVisible, setStreamsVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axios.get(`${baseURL}/api/registration-requests/starting-months`)
      .then(res => {
        setMonths(res.data.months);
        setForm(f => ({ ...f, startingMonth: res.data.months[0] }));
      })
      .catch(() => setMonths([]));
  }, [baseURL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'program') {
      setStreamsVisible(value === 'AL');
    }
  };

  const validate = () => {
    if (form.name.trim().split(' ').length < 2) return 'Name must have at least two words.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email address.';
    if (!/^\d{3}\s?\d{7}$/.test(form.phone)) return 'Phone number must be 10 digits (e.g., 071 1234567)';
    if (form.program === 'AL' && !form.stream) return 'Stream is required for AL program.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      const cleanedPhone = form.phone.replace(/\s/g, '');
      await axios.post(`${baseURL}/api/registration-requests`, { ...form, phone: cleanedPhone });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      setError('reCAPTCHA container not found');
      return;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        // This auto-triggers sendOtp on verify
      },
    });
  }
};


  const sendOtp = async () => {
    setError('');
    const cleanedPhone = form.phone.replace(/\s/g, '');

    if (!/^\d{10}$/.test(cleanedPhone)) {
      return setError('Enter a valid 10-digit phone number before sending OTP');
    }

    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const fullNumber = '+94' + cleanedPhone.slice(1); // Convert 071xxxxxxx to +9471xxxxxxx

      const result = await signInWithPhoneNumber(auth, fullNumber, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (err) {
      setError('Failed to send OTP. Try again.');
      console.error(err);
    }
  };

  const verifyOtp = async () => {
    try {
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        className="bg-white p-6 rounded-lg max-w-lg w-full shadow-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h2 className="text-2xl font-bold mb-4 text-red-800">Registration Request</h2>

        {success ? (
          <div className="text-green-600 text-center mb-4">Your request has been submitted successfully.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="w-full border p-2 rounded" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" required />
            
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number (071 1234567)"
              className="w-full border p-2 rounded"
              required
            />

            <div className="flex gap-2 items-center">
              <button type="button" onClick={sendOtp} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Send Code
              </button>
              {otpSent && !otpVerified && (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border p-2 rounded w-1/2"
                  />
                  <button type="button" onClick={verifyOtp} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                    Verify
                  </button>
                </>
              )}
              {otpVerified && <span className="text-green-600">Verified ✅</span>}
            </div>

            <select name="program" value={form.program} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="OL">OL</option>
              <option value="AL">AL</option>
            </select>

            {streamsVisible && (
              <select name="stream" value={form.stream} onChange={handleChange} className="w-full border p-2 rounded">
                <option value="">Select Stream</option>
                <option value="Biology">Biology</option>
                <option value="Maths">Maths</option>
                <option value="Tech">Tech</option>
                <option value="Art">Art</option>
                <option value="Commerce">Commerce</option>
              </select>
            )}

            <input type="text" name="year" value={form.year} onChange={handleChange} placeholder="Academic Year (e.g., 2025)" className="w-full border p-2 rounded" required />

            <select name="duration" value={form.duration} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="6 month">6 Month</option>
              <option value="1 year">1 Year</option>
            </select>

            <input type="text" value={form.startingMonth} readOnly className="w-full border p-2 rounded bg-gray-100 text-gray-600" />

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={!otpVerified}
              className={`w-full text-white py-2 rounded ${otpVerified ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Submit Request
            </button>
          </form>
        )}

        <button onClick={onClose} className="mt-4 w-full text-center text-sm text-red-700 hover:underline">
          Close
        </button>

        <div id="recaptcha-container"></div>
      </motion.div>
    </div>
  );
}
