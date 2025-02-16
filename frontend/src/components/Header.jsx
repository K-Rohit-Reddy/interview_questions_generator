import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Clock, LogOut } from 'lucide-react';

const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (onLogout) {
      onLogout();
      navigate('/login');
    }
  };

  return (
    <header className="fixed w-full top-0 bg-white shadow-lg z-50">
      {/* Container set to same height as InfoHeader */}
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-3xl font-bold text-black">InterviewPro</span>
          <span className="text-base text-gray-500">AI</span>
        </div>

        {/* Account Menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className="flex items-center hover:bg-gray-100 rounded-full p-1.5 transition-colors"
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            <UserCircle2 
              size={40}
              strokeWidth={1.5}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            />
          </button>

          {isMenuOpen && (
            <>
              {/* Overlay to close menu */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-64 z-50 rounded-lg shadow-lg py-2 bg-white ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">Account</p>
                  <p className="text-sm text-gray-500 truncate">{userEmail}</p>
                </div>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/history');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  role="menuitem"
                >
                  <Clock size={18} className="mr-3" />
                  Interview History
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  role="menuitem"
                >
                  <LogOut size={18} className="mr-3" />
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
