import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const InfoHeader = ({ showAuthButtons = false }) => {
  const navigate = useNavigate();

  return (
    <header className="fixed w-full top-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Brand Logo with Navigation */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <span className="text-3xl font-bold text-black">InterviewPro</span>
          <span className="text-base text-gray-500">AI</span>
        </div>
        {showAuthButtons && (
          <div className="flex space-x-3">
            <Button 
              onClick={() => navigate('/login')} 
              className="text-gray-600 border border-gray-300 bg-transparent hover:bg-gray-100 rounded-md px-3 py-1 transition-colors"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')} 
              className="text-gray-600 border border-gray-300 bg-transparent hover:bg-gray-100 rounded-md px-3 py-1 transition-colors"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default InfoHeader;
