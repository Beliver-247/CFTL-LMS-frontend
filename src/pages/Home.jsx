// pages/Home.jsx
import { 
  FaGraduationCap, 
  FaBook, 
  FaChalkboardTeacher, 
  FaUserGraduate,
  FaClock, 
  FaCertificate, 
  FaUsers, 
  FaLaptop,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

export default function Home() {
  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Welcome to College of Fast Track Learning
            </h1>
            <p className="text-xl mb-8">
              Accelerating your educational journey with innovative digital learning solutions in Sri Lanka
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/student-register" 
                className="px-6 py-3 bg-white text-blue-800 font-bold rounded-lg hover:bg-gray-100 transition-colors flex items-center"
              >
                <FaUserGraduate className="mr-2" /> Student Registration
              </a>
              <a 
                href="/teacher-login" 
                className="px-6 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-800 transition-colors flex items-center"
              >
                <FaChalkboardTeacher className="mr-2" /> Educator Portal
              </a>
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
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <FaLaptop className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Modern E-Learning</h3>
              <p className="text-gray-600">
                State-of-the-art digital platform accessible anytime, anywhere
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <FaClock className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accelerated Programs</h3>
              <p className="text-gray-600">
                Complete your qualifications faster with our intensive courses
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <FaCertificate className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Recognized Certifications</h3>
              <p className="text-gray-600">
                Nationally accredited programs with industry recognition
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <FaUsers className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Faculty</h3>
              <p className="text-gray-600">
                Learn from experienced educators and industry professionals
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About Our Institution</h2>
              <p className="text-gray-600 mb-4">
                Established in 2010, the College of Fast Track Learning has revolutionized education in Sri Lanka by combining traditional academic excellence with innovative accelerated learning techniques.
              </p>
              <p className="text-gray-600 mb-4">
                Our Learning Management System provides students, parents, and educators with a comprehensive digital environment that enhances the educational experience while maintaining the personal touch that makes CFTL special.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">15+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="text-2xl font-bold text-blue-600">5,000+</div>
                  <div className="text-gray-600">Graduates</div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="CFTL Campus" 
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have accelerated their education with our proven fast-track programs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="/student-register" 
              className="px-8 py-3 bg-white text-blue-800 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Apply Now
            </a>
            <a 
              href="/parent-login" 
              className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-blue-800 transition-colors"
            >
              Parent Portal
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-6">
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
                <li><a href="/student-register" className="text-gray-400 hover:text-white">Admissions</a></li>
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
                <li>Monday - Friday: 8:00 AM - 5:00 PM</li>
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
    </div>
  );
}