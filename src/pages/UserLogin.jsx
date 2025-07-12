// UserLogin.jsx
import { Link } from 'react-router-dom';

export default function UserLogin() {
  return (
    <div className="flex h-screen font-sans">
      {/* Left red panel */}
      <div className="w-1/2 bg-red-800 text-white flex flex-col justify-center items-center px-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="bg-white rounded p-3 inline-block">
              <div className="text-red-800 font-bold text-xl">CFTL</div>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">COLLEGE OF FAST TRACK LEARNING</h1>
          <p className="text-sm text-red-100 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis.
          </p>
        </div>
      </div>

      {/* Right white panel */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center space-y-6">
        <Link
          to="/parent-login"
          className="w-2/3 text-center px-6 py-3 bg-red-700 text-white rounded-md text-lg font-semibold hover:bg-red-600"
        >
          LOGIN AS A PARENT
        </Link>
        <Link
          to="/teacher-login"
          className="w-2/3 text-center px-6 py-3 bg-red-700 text-white rounded-md text-lg font-semibold hover:bg-red-600"
        >
          LOGIN AS A TEACHER
        </Link>
        <Link
          to="/coordinator-login"
          className="w-2/3 text-center px-6 py-3 bg-red-700 text-white rounded-md text-lg font-semibold hover:bg-red-600"
        >
          LOGIN AS A COORDINATOR
        </Link>
      </div>
    </div>
  );
}
