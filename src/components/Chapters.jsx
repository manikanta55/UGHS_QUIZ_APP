import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';

function Chapters() {
  const navigate = useNavigate();
  const { dark } = useDarkMode();

  // Updated list of chapter names
  const chapterNames = [
    "India: Relief Features",
    "Ideas of Development",
    "Production and Employment",
    "Climate of India",
    "Indian Rivers and Water Resources",
    "The Population",
    "Settlements - Migrations",
    "Rampur : A Village Economy",
    "Globalisation",
    "Food Security",
    "Sustainable Development with Equity",
    "World Between the World Wars",
    "National Liberation Movements in the Colonies",
    "National Movement in India–Partition & Independence : 1939-1947",
    "The Making of Independent India’s Constitution",
    "Election Process in India",
    "Independent India (The First 30 years - 1947-77)",
    "Emerging Political Trends 1977 to 2000",
    "Post - War World and India",
    "Social Movements in Our Times",
    "The Movement for the Formation of Telangana State"
  ];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen relative transition-colors duration-300 ${dark ? 'bg-gray-900' : 'bg-gray-200'}`}>
      <button
        className={`absolute top-6 left-6 font-bold py-2 px-4 rounded ${dark ? 'bg-gray-700 hover:bg-gray-800 text-white' : 'bg-gray-500 hover:bg-gray-700 text-white'}`}
        onClick={() => navigate('/')}
      >
        Back
      </button>
      <h1 className={`text-4xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>Pick a Topic</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl px-4">
        {chapterNames.map((name, i) => (
          <button
            key={i}
            className={`font-bold py-4 px-2 rounded text-left shadow transition-colors duration-200
              ${dark
                ? 'bg-green-700 hover:bg-green-800 text-white'
                : 'bg-green-500 hover:bg-green-700 text-white'
              }`}
            onClick={() => i === 0 && navigate('/quiz/1')}
          >
            {i + 1}. {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Chapters;