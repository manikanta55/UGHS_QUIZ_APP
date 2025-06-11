import { createBrowserRouter } from 'react-router-dom';
import Home from './components/Home.jsx';
import Chapters from './components/Chapters.jsx';
import Quiz from './components/Quiz.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/chapters',
    element: <Chapters />,
  },
  {
    path: '/quiz/1',
    element: <Quiz />,
  },
]);

export default router;