import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useDarkMode } from '../DarkModeContext';
import '../App.css'; // Ensure this file is imported for styles

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

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* Dark/Light mode toggle button */}
      <button
        className={`absolute top-6 right-6 px-4 py-2 rounded font-bold shadow ${dark ? 'bg-gray-700 text-white' : 'bg-white text-gray-900 border'}`}
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle dark mode"
      >
        {dark ? '🌙' : '☀️'}
      </button>
      <h1
  className={`
    text-4xl font-extrabold mb-8 tracking-wide
    ${dark ? 'text-white' : 'text-gray-900'}
    animate-fade-in
    drop-shadow-lg
    transition-colors duration-500
  `}
  style={{
    letterSpacing: '0.1em',
    textShadow: dark
      ? '0 2px 16px rgba(0,255,255,0.15)'
      : '0 2px 16px rgba(0,0,255,0.10)'
  }}
>
  <span className="inline-block animate-bounce-slow">U</span>
  <span className="inline-block animate-bounce-slower">G</span>
  <span className="inline-block animate-bounce">H</span>
  <span className="inline-block animate-bounce-slower">S</span>
  <span className="mx-2">Quiz APP</span>
</h1>
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        {subjects.map((subject) => (
          <button
            key={subject}
            className={`font-bold py-2 px-6 rounded ${dark ? 'bg-blue-700 hover:bg-blue-900 text-white' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
            onClick={() => subject === "Social" && navigate('/chapters')}
            disabled={subject !== "Social"}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Home;



