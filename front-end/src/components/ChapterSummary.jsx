import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import { subjects } from '../subjects';

function ChapterSummary() {
  const navigate = useNavigate();
  const { dark } = useDarkMode();
  const { subject, chapterIdx } = useParams();

  const chapterNames = subjects[subject] || [];
  const chapterName = chapterNames[chapterIdx];

  const BACKEND_API = `http://127.0.0.1:8000/quizzes/${encodeURIComponent(subject)}/${encodeURIComponent(chapterName)}`;

  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(BACKEND_API)
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary || []);
        setLoading(false);
      })
      .catch(() => {
        setSummary([]);
        setLoading(false);
      });
  }, [BACKEND_API]);

  // Emoji list for summary points
  const summaryEmojis = [
    "🌏","🏔️","🏞️","📚","🌊","🏝️","🌦️","🗺️","🌾","🏜️","🏞️","⛰️","🌴","🌧️","🧭","🌋","🌄"
  ];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-2 ${dark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'}`}>
      {/* Enhanced Back Button */}
      <button
        className={`
          absolute top-6 left-6 flex items-center gap-2 font-bold py-2 px-5 rounded-full shadow-lg border-2
          transition-all duration-300
          ${dark
            ? 'bg-gray-800 border-green-500 text-green-200 hover:bg-green-700 hover:text-white'
            : 'bg-white border-green-400 text-green-700 hover:bg-green-100 hover:text-green-900'
          }
        `}
        onClick={() => navigate(`/${subject}/chapters`)}
      >
        <span className="text-xl">←</span>
        <span className="tracking-wide">Back</span>
      </button>

      {/* Enhanced Header */}
      <h1
        className={`
          text-5xl sm:text-6xl font-extrabold mb-10 text-center tracking-tight
          drop-shadow-lg transition-colors duration-500
          ${dark
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-green-400'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-700 to-green-500'
          }
        `}
        style={{
          letterSpacing: '0.04em',
          textShadow: dark
            ? '0 4px 32px rgba(34,197,94,0.18)'
            : '0 4px 32px rgba(34,197,94,0.12)'
        }}
      >
        {chapterName}
        <span className="block text-lg font-semibold mt-1 text-gray-400 dark:text-gray-300">Summary</span>
      </h1>

      <div className={`max-w-5xl w-full p-8 rounded-2xl shadow-2xl border transition-all duration-300 animate-fade-in
        ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
        {/* Render summary here */}
        {loading ? (
          <div className="text-center text-lg py-8">Loading summary...</div>
        ) : summary.length > 0 ? (
          <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {summary.map((point, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-200
                  ${dark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`}
              >
                <span className="text-2xl">{summaryEmojis[idx % summaryEmojis.length]}</span>
                <span className="text-base font-medium">{point}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-red-500 py-8">No summary available.</div>
        )}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate(`/${subject}/chapters`)}
          >
            Back to Chapters
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate(`/${subject}/quiz/${chapterIdx}`)}
          >
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChapterSummary;