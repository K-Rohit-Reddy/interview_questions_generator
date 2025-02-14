import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import WorkflowDiagram from './WorkflowDiagram';

const LandingPage = ({ onStartClick }) => {
  const features = [
    {
      title: "AI-Powered Questions",
      description: "Generate relevant interview questions using advanced AI algorithms",
      icon: "⚡"
    },
    {
      title: "Resume Analysis",
      description: "Extract key information from candidate resumes automatically",
      icon: "📄"
    },
    {
      title: "Customizable Templates",
      description: "Choose from different interview types and experience levels",
      icon: "🎯"
    },
    {
      title: "Interview History",
      description: "Access your past interview question sets and reports",
      icon: "📚"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-gray-900">
              Generate Perfect Interview Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create tailored interview questions based on job requirements and candidate profiles in seconds
            </p>
            <Button
              onClick={onStartClick}
              className="bg-black text-white px-8 py-4 text-lg rounded-lg hover:bg-gray-800 transition-all transform hover:scale-105"
            >
              Start Generating Questions
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all transform hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <span className="text-3xl">{feature.icon}</span>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <WorkflowDiagram />
    </div>
  );
};

export default LandingPage;