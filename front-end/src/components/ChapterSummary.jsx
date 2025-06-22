import React from 'react';
import { useNavigate } from 'react-router-dom';
import data from '../Socialch1.json';
import { useDarkMode } from '../DarkModeContext';

function ChapterSummary() {
  const navigate = useNavigate();
  const { dark } = useDarkMode();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-2 ${dark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'}`}>
      <div className={`max-w-5xl w-full p-8 rounded-2xl shadow-2xl border transition-all duration-300
        ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-200'}`}>
        <h2 className={`text-3xl font-extrabold mb-6 text-center tracking-tight ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
          India: Relief Features <span className="block text-lg font-semibold mt-1 text-gray-400 dark:text-gray-300">Summary</span>
        </h2>
        <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {data.Summary.map((point, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all duration-200
                ${dark ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' : 'bg-blue-50 border-blue-200 hover:bg-blue-100'}`}
            >
              <span className="text-2xl">{["🌏","🏔️","🏞️","📚","🌊","🏝️","🌦️","🗺️","🌾","🏜️","🏞️","⛰️","🌴","🌧️","🧭","🌋","🌄"][idx % 16]}</span>
              <span className="text-base font-medium">{point}</span>
            </div>
          ))}
        </div>
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