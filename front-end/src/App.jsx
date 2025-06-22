import { RouterProvider } from 'react-router-dom';
import router from './routes.jsx';
import './App.css';
import { DarkModeProvider } from './DarkModeContext';

function App() {
  return (
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  );
}

export default App;