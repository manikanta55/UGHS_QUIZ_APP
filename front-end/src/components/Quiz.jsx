import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../DarkModeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { subjects } from '../subjects';

// Helper to get random N items from an array
function getRandomItems(arr, n) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

// New logic: get 3 easy, 4 medium, 3 hard questions
function getRandomQuestionsByDifficulty(mcqs) {
  const easy = mcqs.filter(q => (q.difficulty || '').toLowerCase() === 'easy');
  const medium = mcqs.filter(q => (q.difficulty || '').toLowerCase() === 'medium');
  const hard = mcqs.filter(q => (q.difficulty || '').toLowerCase() === 'hard');

  // Fallback to as many as available if not enough in a category
  const easyQs = getRandomItems(easy, Math.min(3, easy.length));
  const mediumQs = getRandomItems(medium, Math.min(4, medium.length));
  const hardQs = getRandomItems(hard, Math.min(3, hard.length));

  // Combine and shuffle the final set
  const combined = [...easyQs, ...mediumQs, ...hardQs].sort(() => 0.5 - Math.random());
  return combined;
}

const QUESTIONS_KEY = 'quiz_questions';

function Quiz() {
  const { dark } = useDarkMode();
  const navigate = useNavigate();
  const { subject, chapterIdx } = useParams();
  const chapterNames = subjects[subject] || [];
  const chapterName = chapterNames[chapterIdx];

  const BACKEND_API = `http://127.0.0.1:8000/quizzes/${encodeURIComponent(subject)}/${encodeURIComponent(chapterName)}`;

  const [quizData, setQuizData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(BACKEND_API);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data.mcqs)) {
          throw new Error('Invalid quiz data');
        }
        setQuizData(data);
        const selectedQuestions = getRandomQuestionsByDifficulty(data.mcqs);
        setQuestions(selectedQuestions);
        setLoading(false);
      } catch (error) {
        console.error('Error loading quiz:', error);
        navigate('/error'); // Redirect to error page
      }
    };
    fetchData();
  }, [BACKEND_API, navigate]);

  const handleOptionChange = (qIdx, option) => {
    setSelected({ ...selected, [qIdx]: option });
  };

  const score = questions.reduce(
    (acc, q, idx) => acc + (selected[idx] === q.answer ? 1 : 0),
    0
  );

  const allAnswered = questions.length > 0 && questions.every((_, idx) => selected[idx] !== undefined);

  const handleTryAgain = () => {
    if (quizData && Array.isArray(quizData.mcqs)) {
      const newQuestions = getRandomQuestionsByDifficulty(quizData.mcqs);
      setQuestions(newQuestions);
      setSelected({});
      setShowAnswers(false);
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(newQuestions));
      window.scrollTo(0, 0); // Scroll to top after try again
    }
  };

  const handleQuizSubmit = async () => {
    setShowAnswers(true);
    window.scrollTo(0, 0);

    // Save score to backend
    const studentName = localStorage.getItem('student_name');
    const studentRollNo = localStorage.getItem('student_roll_no');
    const token = localStorage.getItem('token');
    if (!studentName || !studentRollNo || !token) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject,
          chapter: chapterName,
          score
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save score');
      }

      const data = await response.json();
      console.log('Score saved successfully:', data);
    } catch (err) {
      console.error('Failed to save score:', err);
      // You might want to show an error message to the user
    }
  };

  // Always scroll to top when this page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-2 ${dark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
          <p className="text-xl">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData || !questions.length) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center px-2 ${dark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Not Available</h2>
          <p className="text-gray-600">Please try again later.</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-2 ${dark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900'}`}>
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{quizData.subject} - {quizData.chapter} - Quiz</h1>
          <p className="text-xl text-gray-600">{quizData.description}</p>
        </div>
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
          // For Submit & Show Answers
          <button
            className={`bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleQuizSubmit}
            disabled={!allAnswered}
          >
            Submit & Show Answers
          </button>
        )}
        {showAnswers && (
          <div className="flex gap-4">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded mt-4"
              onClick={handleTryAgain}
            >
              Try Again
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded mt-4"
              onClick={() => navigate(`/${subject}/chapters`)}
            >
              Back to Chapters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;