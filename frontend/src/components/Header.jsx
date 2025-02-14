import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
      navigate('/login'); // Add navigation after logout
    }
  };

  return (
    <header className="fixed w-full top-0 bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo with Navigation */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl font-bold text-black">InterviewPro</span>
          <span className="text-sm text-gray-500">AI</span>
        </div>

        {/* Account Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-3 hover:bg-gray-100 rounded-full px-3 py-2 transition-colors"
          >
            <span className="text-sm text-gray-600 hidden sm:block">
              {userEmail}
            </span>
            <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
              {userEmail?.charAt(0).toUpperCase() || 'A'}
            </div>
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-medium text-gray-900">Account</p>
                  <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/history');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Interview History
                </button>
                
                <button
                  onClick={handleLogout}  // Use handleLogout instead of direct onLogout
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;