import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentLogin() {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  // Clear form fields when switching between login and signup
  const handleModeSwitch = () => {
    setName('');
    setRollNo('');
    setPassword('');
    setError('');
    setIsSignup(!isSignup);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      // Validate name
      if (!/^[A-Za-z\s]+$/.test(name.trim())) {
        setError('Name must contain only letters and spaces');
        return;
      }

      // Validate roll_no as numeric
      const parsedRollNo = parseInt(rollNo.trim());
      if (isNaN(parsedRollNo)) {
        setError('Roll number must be a number');
        return;
      }

      // Send login request
      const response = await fetch(`http://127.0.0.1:8000/auth/${isSignup ? 'signup' : 'token'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roll_no: parsedRollNo,
          name: name.trim(),
          password: password.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid credentials');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('student_name', name.trim());
      localStorage.setItem('student_roll_no', parsedRollNo);
      navigate('/home');
    } catch (error) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
          {isSignup ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold mb-2 text-blue-900">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2 text-blue-900">Roll No</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              placeholder="Enter your roll number"
            />
          </div>
          <div>
            <label className="block text-lg font-semibold mb-2 text-blue-900">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <div className="text-red-500 text-center">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-200"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleModeSwitch}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            {isSignup ? 'Already have an account? Login' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;