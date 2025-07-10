import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home.jsx';
import Chapters from './components/Chapters.jsx';
import Quiz from './components/Quiz.jsx';
import ChapterSummary from './components/ChapterSummary';
import StudentLogin from './components/StudentLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';

const router = createBrowserRouter([
  { path: '/', element: <StudentLogin /> },
  { path: '/login', element: <StudentLogin /> },
  { 
    path: '/home', 
    element: <ProtectedRoute><Home /></ProtectedRoute> 
  },
  { 
    path: '/dashboard', 
    element: <ProtectedRoute><Dashboard /></ProtectedRoute> 
  },
  { 
    path: '/:subject/chapters', 
    element: <ProtectedRoute><Chapters /></ProtectedRoute> 
  },
  { 
    path: '/:subject/summary/:chapterIdx', 
    element: <ProtectedRoute><ChapterSummary /></ProtectedRoute>
  },
  { 
    path: '/:subject/quiz/:chapterIdx', 
    element: <ProtectedRoute><Quiz /></ProtectedRoute> 
  },
]);

export default router;