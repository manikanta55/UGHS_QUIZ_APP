import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import '../App.css';
import UGHSLogo from '../UGHS_LOGO_1.png';
import { subjects } from '../subjects';

function Home() {
  const { dark, setDark } = useDarkMode();
  const navigate = useNavigate();
  const studentName = localStorage.getItem('student_name');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

   // Set dark mode as default
  //  useEffect(() => {
  //   setDark(true);
  // }, [setDark]);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const checkSession = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/auth/session', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('token');
          localStorage.removeItem('student_name');
          localStorage.removeItem('student_roll_no');
          navigate('/login');
        }
      } catch (error) {
        navigate('/login');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen w-full
      ${dark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'
      } transition-colors duration-500`}>

      {/* Header with student name */}
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Dashboard button */}
          <button 
            onClick={() => navigate('/dashboard')}
            className={`px-4 py-2 rounded-full font-bold shadow-lg border-2
              ${dark ? 'bg-gray-700 text-white border-blue-400 hover:bg-gray-800' : 'bg-white text-gray-900 border-blue-300 hover:bg-blue-100'}
              transition-all duration-300`}
          >
            📊
          </button>

          {/* Student name display */}
          <div className={`relative text-xl font-semibold tracking-wide
            ${dark ? 'text-blue-400' : 'text-blue-600'}
            transition-all duration-500 transform hover:scale-105
            bg-gradient-to-r from-transparent to-blue-500/10 dark:to-blue-400/10
            backdrop-blur-sm
            rounded-lg
            px-4 py-1.5
            shadow-sm
            hover:shadow-md
            border-2 border-transparent
            hover:border-blue-400/50 dark:hover:border-blue-400/30`}
          >
            {studentName && (
              <span className="inline-flex items-center space-x-2">
                <span className="animate-fade-in">Hello,</span>
                <span className="animate-fade-in delay-100">{studentName}</span>
              </span>
            )}
          </div>

          {/* Dark/Light mode toggle and logout buttons */}
          <div className="flex items-center space-x-4">
            <button
              className={`px-4 py-2 rounded-full font-bold shadow-lg border-2
                ${dark ? 'bg-gray-700 text-white border-blue-400 hover:bg-gray-800' : 'bg-white text-gray-900 border-blue-300 hover:bg-blue-100'}
                transition-all duration-300`}
              onClick={() => setDark((d) => !d)}
              aria-label="Toggle dark mode"
            >
              {dark ? '🌙' : '☀️'}
            </button>

            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-full font-bold shadow-lg border-2
                ${dark ? 'bg-red-700 text-white border-red-400 hover:bg-red-800' : 'bg-red-200 text-red-900 border-red-300 hover:bg-red-100'}
                transition-all duration-300`}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* UGHS Logo above the header */}
      <img
        src={UGHSLogo}
        alt="UGHS Logo"
        className="
          w-48 h-48
          object-cover
          drop-shadow-2xl
          mb-3
          mt-4
          animate-fade-in
          rounded-full
          border-4
          border-blue-400
          transition-transform
          duration-500
          hover:scale-105
          hover:shadow-blue-400/50
          shadow-blue-300/30
        "
      />

      {/* Animated menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-64 transform transition-transform duration-300 ease-in-out">
            <div className="space-y-4">
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-2 rounded ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
                  transition-all duration-200 text-left`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top right buttons container */}
      {/* <div className="absolute top-6 right-6 flex items-center space-x-4">
        {/* Dark/Light mode toggle button */}
        {/* <button
          className={`px-4 py-2 rounded-full font-bold shadow-lg border-2
            ${dark ? 'bg-gray-700 text-white border-blue-400 hover:bg-gray-800' : 'bg-white text-gray-900 border-blue-300 hover:bg-blue-100'}
            transition-all duration-300`}
          onClick={() => setDark((d) => !d)}
          aria-label="Toggle dark mode"
        >
          {dark ? '🌙' : '☀️'}
        </button> */}

        {/* Logout button */}
        {/* <button
          onClick={handleLogout}
          className={`px-4 py-2 rounded-full font-bold shadow-lg border-2
            ${dark ? 'bg-red-700 text-white border-red-400 hover:bg-red-800' : 'bg-red-200 text-red-900 border-red-300 hover:bg-red-100'}
            transition-all duration-300`}>
          Logout
        </button>
      </div>  */}
      
      <h1
        className={`
          text-4xl sm:text-5xl font-extrabold mb-10 tracking-wide text-center
          ${dark ? 'text-blue-200' : 'text-blue-900'}
          animate-fade-in
          drop-shadow-lg
          transition-colors duration-500
        `}
        style={{
          letterSpacing: '0.1em',
          textShadow: dark
            ? '0 2px 16px rgba(0,255,255,0.18)'
            : '0 2px 16px rgba(0,0,255,0.12)'
        }}>
        <span className="inline-block animate-bounce-slow">U</span>
        <span className="inline-block animate-bounce-slower">G</span>
        <span className="inline-block animate-bounce">H</span>
        <span className="inline-block animate-bounce-slower">S</span>
        <span className="mx-2">Quiz APP</span>
      </h1>

      {/* {studentName && (
        <div className={`flex items-center space-x-2 text-lg font-semibold ml-4
          ${dark ? 'text-blue-400' : 'text-blue-600'}
          transition-all duration-300`}>
          <span className="animate-fade-in">Hi,</span>
          <span className="animate-fade-in delay-100">{studentName}</span>
          <div className={`w-2 h-2 rounded-full ${dark ? 'bg-blue-400' : 'bg-blue-600'}
            animate-pulse`} />
        </div>
      )} */}

      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl px-2 sm:px-4">
          {Object.keys(subjects).map((subject) => (
            <button
              key={subject}
              className={`
                font-bold py-4 px-6 rounded-xl shadow-lg text-lg
                transition-all duration-200 transform hover:scale-105
                ${dark
                  ? 'bg-blue-800 hover:bg-blue-900 text-blue-100'
                  : 'bg-blue-200 hover:bg-blue-400 text-blue-900'
                }
              `}
              onClick={() => navigate(`/${subject}/chapters`)}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <footer
        className={`
          fixed bottom-0 left-0 w-full
          py-3 text-center text-sm font-medium flex items-center justify-center gap-2
          ${dark ? 'bg-gray-800 text-blue-200' : 'bg-gray-200 text-blue-800'}
          shadow-inner
        `}
        style={{ zIndex: 50 }}
      >
        <span className="text-lg">©</span>
        <span>All rights reserved to Unique Grammar School</span>
      </footer>
    </div>
    )
}

export default Home;