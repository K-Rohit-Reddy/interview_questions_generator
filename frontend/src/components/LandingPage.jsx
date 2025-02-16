import React from 'react';
import { Button } from "./ui/button";

const LandingPage = ({ onStartClick }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-50 to-white">
      {/* Creative Background SVG */}
      <svg
        className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-10 pointer-events-none animate-pulse-slow"
        width="1000"
        height="800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bgGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        <circle cx="500" cy="400" r="400" fill="url(#bgGradient)" />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900">
          You're One Step Away From
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Revolutionizing Your Hiring Process
          </span>
        </h1>
        <p className="mt-6 text-xl text-gray-700 max-w-xl">
          Unlock tailored, AI-powered interview questions designed for HR professionals. Streamline your recruitment and build the dream team—fast.
        </p>
        <Button
          onClick={onStartClick}
          className="mt-10 bg-black text-white px-8 py-4 text-lg rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105"
        >
          Transform Your Hiring Today
        </Button>
      </div>
    </div>
  );
};

export default LandingPage;
