// Home.jsx
import { useState } from 'react';
import RegistrationRequestModal from '../Modals/RegistrationRequestModal';
import {
  FaLaptop,
  FaClock,
  FaCertificate,
  FaUsers,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-red-800 text-white py-20 md:py-28">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Welcome to College of Fast Track Learning
            </h1>
            <p className="text-xl mb-8">
              Accelerating your educational journey with innovative digital learning solutions in Sri Lanka
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-white text-red-800 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Request Registration
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 -mb-8"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose CFTL?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ icon: FaLaptop, title: 'Modern E-Learning', desc: 'Accessible anytime, anywhere' },
              { icon: FaClock, title: 'Accelerated Programs', desc: 'Complete qualifications faster' },
              { icon: FaCertificate, title: 'Recognized Certifications', desc: 'Nationally accredited' },
              { icon: FaUsers, title: 'Expert Faculty', desc: 'Learn from professionals' }].map((f, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md text-center">
                <f.icon className="text-4xl text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have accelerated their education with our fast-track programs
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-white text-red-700 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Request Registration
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaGraduationCap className="mr-2" /> CFTL LMS
              </h3>
              <p className="text-gray-400">
                Empowering the next generation of learners through innovative education technology.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="/coordinator-login" className="text-gray-400 hover:text-white">Course Coordinators</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" /> 123 Education Ave, Colombo
                </li>
                <li className="flex items-center">
                  <FaPhone className="mr-2" /> +94 11 234 5678
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="mr-2" /> info@cftl.edu.lk
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Operating Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Mon - Fri: 8:00 AM - 5:00 PM</li>
                <li>Saturday: 9:00 AM - 1:00 PM</li>
                <li>Sunday: Closed</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} College of Fast Track Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showModal && <RegistrationRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
