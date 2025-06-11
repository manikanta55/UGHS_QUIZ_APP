import React, { useState } from 'react';
import data from '../Socialch1.json';
import { useDarkMode } from '../DarkModeContext';

function getRandomQuestions(mcqs, count = 10) {
  const shuffled = [...mcqs].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const QUESTIONS_KEY = 'quiz_questions';

function Quiz() {
  const { dark } = useDarkMode();
  const hasQuestions = Array.isArray(data.MCQs) && data.MCQs.length >= 1;

  // Load from localStorage or generate new
  const getInitialQuestions = () => {
    const saved = localStorage.getItem(QUESTIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to new questions if parse fails
      }
    }
    const newQuestions = hasQuestions ? getRandomQuestions(data.MCQs, Math.min(10, data.MCQs.length)) : [];
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(newQuestions));
    return newQuestions;
  };

  const [questions, setQuestions] = useState(getInitialQuestions);
  const [selected, setSelected] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleOptionChange = (qIdx, option) => {
    setSelected({ ...selected, [qIdx]: option });
  };

  const score = questions.reduce(
    (acc, q, idx) => acc + (selected[idx] === q.answer ? 1 : 0),
    0
  );

  const allAnswered = questions.length > 0 && questions.every((_, idx) => selected[idx] !== undefined);

  const handleTryAgain = () => {
    const newQuestions = getRandomQuestions(data.MCQs, Math.min(10, data.MCQs.length));
    setQuestions(newQuestions);
    setSelected({});
    setShowAnswers(false);
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(newQuestions));
  };

  if (!hasQuestions) {
    return (
      <div className={`max-w-2xl mx-auto py-8 font-bold ${dark ? 'text-red-400' : 'text-red-600'}`}>
        No quiz data available.
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full ${dark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto py-8">
        <h2 className={`text-2xl font-bold mb-6`}>India: Relief Features - Quiz</h2>
        {showAnswers && (
          <>
            <div className="mb-2 text-xl font-semibold text-blue-700 dark:text-blue-300">
              Your Score: {score} / {questions.length}
            </div>
            {score >= 8 ? (
              <div className="mb-6 text-green-700 dark:text-green-400 font-bold text-lg">Keep it up!</div>
            ) : (
              <div className="mb-6 text-yellow-700 dark:text-yellow-400 font-bold text-lg">
                Make sure you revise the topic/Summary and try to attempt the questions again.
              </div>
            )}
          </>
        )}
        {questions.map((q, idx) => (
          <div key={idx} className={`mb-8 p-4 rounded shadow ${dark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`font-semibold mb-2`}>{idx + 1}. {q.question}</div>
            <div className="space-y-2">
              {Object.entries(q.options).map(([key, value]) => {
                let optionClass = "";
                if (showAnswers) {
                  if (key === q.answer) {
                    optionClass = "bg-green-100 border-green-500 dark:bg-green-900 dark:border-green-400";
                  } else if (selected[idx] === key && selected[idx] !== q.answer) {
                    optionClass = "bg-red-100 border-red-500 dark:bg-red-900 dark:border-red-400";
                  }
                }
                return (
                  <div key={key}>
                    <label className={`cursor-pointer flex items-center border rounded px-2 py-1 ${optionClass} ${dark ? 'text-white' : ''}`}>
                      <input
                        type="radio"
                        name={`q${idx}`}
                        className="mr-2"
                        value={key}
                        checked={selected[idx] === key}
                        onChange={() => handleOptionChange(idx, key)}
                        disabled={showAnswers}
                      />
                      {key}. {value}
                    </label>
                  </div>
                );
              })}
            </div>
            {showAnswers && (
              <div className="mt-3">
                <div className={selected[idx] === q.answer ? "text-green-600 dark:text-green-400 font-semibold" : "text-red-600 dark:text-red-400 font-semibold"}>
                  Your answer: {selected[idx] ? `${selected[idx]}. ${q.options[selected[idx]]}` : "Not answered"}
                </div>
                <div className="text-blue-700 dark:text-blue-300 font-semibold">
                  Correct answer: {q.answer}. {q.options[q.answer]}
                </div>
                <div className="text-gray-700 dark:text-gray-300 mt-1">
                  Explanation: {q.explanation}
                </div>
              </div>
            )}
          </div>
        ))}
        {!showAnswers && (
          <button
            className={`bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setShowAnswers(true)}
            disabled={!allAnswered}
          >
            Submit & Show Answers
          </button>
        )}
        {showAnswers && (
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded mt-4"
            onClick={handleTryAgain}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;