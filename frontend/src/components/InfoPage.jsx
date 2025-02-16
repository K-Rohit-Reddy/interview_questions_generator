import React, { useMemo } from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InfoHeader from "./InfoHeader";
import Footer from "./Footer";
import WorkflowDiagram from "./WorkflowDiagram";

const FeatureCard = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="h-full"
  >
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-lg transition-transform transform hover:-translate-y-1">
      <div className="flex flex-col items-center gap-4 mb-4">
        <div className={`${feature.color} w-14 h-14 rounded-full flex items-center justify-center text-white text-3xl`}>
          {feature.icon}
        </div>
        <span className="text-xl font-semibold text-center">{feature.title}</span>
      </div>
      <div>
        <p className="text-gray-600 text-base text-center">{feature.shortDescription}</p>
      </div>
    </div>
  </motion.div>
);

const InfoPage = () => {
  const navigate = useNavigate();

  const features = useMemo(
    () => [
      {
        id: "ai-score-generation",
        title: "AI-Powered Analysis",
        shortDescription: "Analyze job descriptions and resumes to generate accurate compatibility scores.",
        icon: "📊",
        color: "bg-blue-600",
      },
      {
        id: "question-generation",
        title: "Smart Questioning",
        shortDescription: "Generate tailored interview questions based on candidate profiles and job roles.",
        icon: "⚡",
        color: "bg-purple-600",
      },
      {
        id: "resume-analysis",
        title: "Resume Extraction",
        shortDescription: "Automatically extract and summarize key details from resumes.",
        icon: "📄",
        color: "bg-green-600",
      },
      {
        id: "interview-templates",
        title: "Custom Templates",
        shortDescription: "Use pre-built interview templates tailored for different industries.",
        icon: "🎯",
        color: "bg-orange-600",
      },
      {
        id: "interview-history",
        title: "Track History",
        shortDescription: "Maintain records of past interviews and responses for future reference.",
        icon: "📚",
        color: "bg-indigo-600",
      },
      {
        id: "analytics-insights",
        title: "Analytics & Insights",
        shortDescription: "Get detailed analytics and insights to optimize your hiring process over time.",
        icon: "📈",
        color: "bg-pink-600",
      }
    ],
    []
  );

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ scrollBehavior: "smooth" }}>
      <InfoHeader showAuthButtons={true} />

      <br />
      {/* Main container with scroll snapping */}
      <main className="relative scroll-snap-type-y-mandatory">
        {/* Hero Section */}
        <section
          id="hero"
          className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-blue-50 to-white scroll-snap-align-start"
        >
          {/* Background SVG */}
          <svg
            className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-10 pointer-events-none"
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

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 space-y-12 text-center">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight tracking-normal">
                Revolutionize Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                  Hiring Process
                </span>
              </h1>
              <p className="text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-light">
                Harness the power of AI to transform how you identify, evaluate, and select top talent.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Smart Screening</h3>
                <p className="text-gray-600">Reduce time-to-hire by 60% with AI-powered candidate screening</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Bias Reduction</h3>
                <p className="text-gray-600">Implement fair hiring practices with objective AI evaluation</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">Data-Driven</h3>
                <p className="text-gray-600">Make informed decisions backed by comprehensive analytics</p>
              </div>
            </div>

            <div className="pt-8">
              <p className="text-sm text-gray-500 mb-6">
                Get started today and see results within weeks
              </p>
              <Button
                onClick={() => navigate("/signup")}
                className="bg-black text-white px-8 py-4 text-xl font-bold rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105"
              >
                Get Started !
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="min-h-screen py-24 bg-white scroll-snap-align-start"
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="sticky top-0 bg-white z-10 py-6">
              <h2 className="text-5xl font-bold text-gray-900 text-center">
                Key Features
              </h2>
              <p className="mt-4 text-xl text-gray-600 text-center max-w-3xl mx-auto">
                Everything you need to streamline your hiring process
              </p>
            </div>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <FeatureCard key={feature.id} feature={feature} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section
          id="workflow"
          className="min-h-screen py-24 bg-white scroll-snap-align-start"
        >
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Our AI-driven workflow takes you through every step of the interview process — from job input to question generation — ensuring a seamless and efficient experience.
            </p>
            <WorkflowDiagram />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default InfoPage;
