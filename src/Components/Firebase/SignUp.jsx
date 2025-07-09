import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { GoogleAuthProvider } from 'firebase/auth';
import { AuthContext } from './AuthProvider'; // your context providing signup and googleProvider functions
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, googleProvider } = useContext(AuthContext);
  const provider = new GoogleAuthProvider();

  // Google Signup handler
  const handleGoogleSignUp = () => {
    googleProvider(provider)
      .then(() => {
        toast.success('Signed up with Google!');
        navigate('/');
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  // Email/Password signup handler
  const handleSignup = (e) => {
    e.preventDefault();

    const name = e.target.fullName.value.trim();
    const email = e.target.email.value.trim();
    const photo = e.target.photo.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password || !name) {
      toast.error('Please fill in all required fields.');
      return;
    }

    signUpWithEmail(email, password, { displayName: name, photoURL: photo })
      .then(() => {
        toast.success('Account created successfully!');
        navigate('/');
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-animated" />

      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="bg-white bg-opacity-90 shadow-xl rounded-xl max-w-md w-full p-10"
        >
          <h2 className="text-3xl font-extrabold text-indigo-900 mb-8 text-center">
            Create your account
          </h2>

          <form onSubmit={handleSignup} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                id="fullName"
                placeholder="Enter your full name"
                required
                className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="you@example.com"
                required
                className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="photo"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                Photo URL (optional)
              </label>
              <input
                type="url"
                name="photo"
                id="photo"
                placeholder="Photo URL"
                className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-indigo-700 mb-1"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
                className="input input-bordered w-full focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold transition"
            >
              Sign Up
            </button>

            <button
              onClick={handleGoogleSignUp}
              type="button"
              className="btn btn-outline w-full flex items-center justify-center gap-3 border-indigo-700 text-indigo-700 hover:bg-indigo-100 transition font-semibold mt-2"
            >
              <svg
                aria-label="Google logo"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path fill="#4285F4" d="M113.47 309.408l12.9 42.56 36.15-5.56-2.27-14.4a106 106 0 0 1-46.78-22.6z" />
                <path fill="#34A853" d="M256 371.243c46.69 0 85.53-15.56 114.04-42.3l-54.41-44.06a124.66 124.66 0 0 1-59.59 17.36 128.56 128.56 0 0 1-102.07-53.5l-49.88 38.53a192.31 192.31 0 0 0 151.91 83.97z" />
                <path fill="#FBBC05" d="M121.63 241.18a128.38 128.38 0 0 1 0-78.34l-49.89-38.52a193.66 193.66 0 0 0 0 155.38z" />
                <path fill="#EA4335" d="M256 132.756c32.72 0 55.02 14.19 67.65 26.05l49.34-48.05a196.04 196.04 0 0 0-117-39.35C166.43 71.36 101.11 125.43 79.74 186.7l49.88 38.53a128.56 128.56 0 0 1 126.38-92.48z" />
              </svg>
              Sign Up with Google
            </button>

            <p className="text-center text-indigo-700 mt-6 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-pink-600 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Custom styles for animated gradient */}
      <style>{`
        .bg-gradient-animated {
          background: linear-gradient(270deg, #7f00ff, #e100ff, #00eaff, #00ff6a);
          background-size: 800% 800%;
          animation: gradientShift 15s ease infinite;
        }
        @keyframes gradientShift {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
      `}</style>
    </>
  );
};

export default SignUp;
