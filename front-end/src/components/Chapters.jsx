import { useNavigate, useParams } from 'react-router-dom';
import { useDarkMode } from '../DarkModeContext';
import { subjects } from '../subjects';

function Chapters() {
  const navigate = useNavigate();
  const { dark } = useDarkMode();
  const { subject } = useParams();

  const chapterNames = subjects[subject] || [];

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen relative transition-colors duration-300 ${dark ? 'bg-gray-900' : 'bg-gray-200'}`}>
      {/* Enhanced Back Button */}
      <button
        className={`
          absolute top-6 left-6 flex items-center gap-2 font-bold py-2 px-5 rounded-full shadow-lg border-2
          transition-all duration-300
          ${dark
            ? 'bg-gray-800 border-green-500 text-green-200 hover:bg-green-700 hover:text-white'
            : 'bg-white border-green-400 text-green-700 hover:bg-green-100 hover:text-green-900'
          }
        `}
        onClick={() => navigate('/home')}
      >
        <span className="text-xl">←</span>
        <span className="tracking-wide">Back</span>
      </button>

      {/* Enhanced Header */}
      <h1
        className={`
          text-5xl sm:text-6xl font-extrabold mb-10 text-center tracking-tight
          drop-shadow-lg transition-colors duration-500
          ${dark
            ? 'text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-green-400'
            : 'text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-700 to-green-500'
          }
        `}
        style={{
          letterSpacing: '0.04em',
          textShadow: dark
            ? '0 4px 32px rgba(34,197,94,0.18)'
            : '0 4px 32px rgba(34,197,94,0.12)'
        }}
      >
        Pick a Chapter
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full max-w-7xl px-4">
        {chapterNames.map((name, i) => (
          <button
            key={i}
            className={`
              flex flex-col items-start justify-center
              font-extrabold py-10 px-6 rounded-2xl text-left shadow-2xl text-xl
              border-2 transition-all duration-200 transform hover:scale-105
              tracking-wide leading-snug
              ${dark
                ? 'bg-green-800 hover:bg-green-900 text-white border-green-600'
                : 'bg-green-100 hover:bg-green-200 text-green-900 border-green-400'
              }
            `}
            style={{
              minHeight: '160px',
              fontSize: '1.25rem',
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              boxShadow: dark
                ? '0 8px 32px 0 rgba(34,197,94,0.25)'
                : '0 8px 32px 0 rgba(34,197,94,0.12)'
            }}
            onClick={() => navigate(`/${subject}/summary/${i}`)}
          >
            <span className="text-base font-semibold opacity-70 mb-1">
              Chapter {i + 1}
            </span>
            <span className="text-lg font-bold">{name.replace(/^Chapter \d+ - /, '')}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Chapters;