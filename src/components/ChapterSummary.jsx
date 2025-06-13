import React from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../Socialch1.json';
import { useDarkMode } from '../DarkModeContext';

function ChapterSummary() {
  const navigate = useNavigate();
  const { dark } = useDarkMode();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-2 ${dark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'}`}>
      <div className={`max-w-2xl w-full p-8 rounded-2xl shadow-2xl border transition-all duration-300
        ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
        <h2 className={`text-3xl font-extrabold mb-6 text-center tracking-tight ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
          India: Relief Features <span className="block text-lg font-semibold mt-1 text-gray-400 dark:text-gray-300">Summary</span>
        </h2>
        <ul className="mb-8 list-disc pl-8 space-y-3">
          {data.Summary.map((point, idx) => (
            <li
              key={idx}
              className={`relative pl-2 text-lg leading-relaxed transition-colors duration-200
                ${dark ? 'hover:text-blue-200' : 'hover:text-blue-700'}`}
            >
              <span className={`absolute left-[-1.2em] top-1 text-blue-400 dark:text-blue-300 text-xl`}>•</span>
              {point}
            </li>
          ))}
        </ul>
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-600 hover:to-gray-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate('/chapters')}
          >
            Back to Chapters
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
            onClick={() => navigate('/quiz/1')}
          >
            Take Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChapterSummary;