import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useDarkMode } from '../DarkModeContext';
import '../App.css';
import UGHSLogo from '../UGHS_LOGO_1.png';

function Home() {
  const navigate = useNavigate();
  const { dark, setDark } = useDarkMode();

  const subjects = [
    "Telugu",
    "Hindi",
    "English",
    "Maths",
    "Science",
    "Social"
  ];

  // Set dark mode as default
  useEffect(() => {
    setDark(true);
  }, [setDark]);

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen w-full
      ${dark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'
      } transition-colors duration-500`}>

      {/* Dark/Light mode toggle button */}
      <button
        className={`absolute top-6 right-6 px-4 py-2 rounded-full font-bold shadow-lg border-2
          ${dark ? 'bg-gray-700 text-white border-blue-400 hover:bg-gray-800' : 'bg-white text-gray-900 border-blue-300 hover:bg-blue-100'}
          transition-all duration-300`}
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle dark mode"
      >
        {dark ? '🌙' : '☀️'}
      </button>

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
        }}
      >
        <span className="inline-block animate-bounce-slow">U</span>
        <span className="inline-block animate-bounce-slower">G</span>
        <span className="inline-block animate-bounce">H</span>
        <span className="inline-block animate-bounce-slower">S</span>
        <span className="mx-2">Quiz APP</span>
      </h1>

      <div className="w-full flex justify-center">
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl px-2 sm:px-4">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`
                font-bold py-4 px-6 rounded-xl shadow-lg text-lg
                transition-all duration-200 transform hover:scale-105
                ${dark
                  ? 'bg-blue-800 hover:bg-blue-900 text-blue-100'
                  : 'bg-blue-200 hover:bg-blue-400 text-blue-900'
                }
                ${subject !== "Social" ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              onClick={() => subject === "Social" && navigate('/chapters')}
              disabled={subject !== "Social"}
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
  );
}

export default Home;



