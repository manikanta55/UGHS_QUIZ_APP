import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { subjects } from '../subjects';

function Dashboard() {
  const navigate = useNavigate();
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);



  useEffect(() => {
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://127.0.0.1:8000/scores', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scores');
        }

        const data = await response.json();
        
        // Transform scores data to match our UI needs
        const transformedScores = {};
        if (data.scores) {
          Object.entries(data.scores).forEach(([subject, scores]) => {
            transformedScores[subject] = {};
            scores.forEach(score => {
              if (!transformedScores[subject][score.chapter]) {
                transformedScores[subject][score.chapter] = [];
              }
              transformedScores[subject][score.chapter].push(score);
            });
          });
        }
        
        setScores(transformedScores);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scores:', error);
        setLoading(false);
      }
    };

    fetchScores();
  }, [navigate]);

  const getLatestScore = (subjectScores, chapter) => {
    if (!subjectScores || !subjectScores[chapter] || subjectScores[chapter].length === 0) return null;
    return subjectScores[chapter][subjectScores[chapter].length - 1]; // Get the most recent score for this chapter
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <button
        onClick={() => navigate('/home')}
        className="absolute left-4 top-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
      >
        ← Back to Home
      </button>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Your Quiz Scores</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Subject Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.keys(scores).sort().map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`
                    w-full py-4 rounded-lg text-center font-semibold transition-all duration-200
                    ${selectedSubject === subject ? 'bg-blue-500 text-white' : 'bg-white text-blue-700 hover:bg-blue-50'}
                  `}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Scores Display */}
            {selectedSubject && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-blue-700 mb-6">{selectedSubject}</h2>
                
                {/* Display scores by chapter */}
                {Object.entries(scores[selectedSubject] || {}).sort().map(([chapter, chapterScores]) => (
                  <div key={chapter} className="mb-6">
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-t-lg mb-4">
                      <h4 className="text-blue-700 font-semibold">{chapter}</h4>
                      <span className="text-gray-600 bg-blue-100 px-2 py-1 rounded">
                        {Array.isArray(chapterScores) ? chapterScores.length : 0} Tests
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-b-lg">
                        <thead className="bg-blue-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {Array.isArray(chapterScores) && chapterScores.length > 0 ? (
                            chapterScores.sort((a, b) => new Date(b.date) - new Date(a.date)).map((score, index) => (
                              <tr key={index} className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Test {index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`font-bold ${score.score >= 8 ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {score.score}/10
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(score.date).toLocaleDateString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                                No scores available for this chapter
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
