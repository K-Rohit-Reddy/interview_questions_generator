import React from 'react';
import { motion } from 'framer-motion';

const WorkflowDiagram = () => {
  const steps = [
    {
      icon: "💼",
      title: "Input Job Details",
      description: "Enter position details and skills needed",
      color: "bg-blue-600"
    },
    {
      icon: "📄",
      title: "Upload Resume",
      description: "Submit candidate's CV for AI analysis",
      color: "bg-purple-600"
    },
    {
      icon: "🎯",
      title: "Select Parameters",
      description: "Choose interview type and level",
      color: "bg-green-600"
    },
    {
      icon: "✨",
      title: "Generate & Review",
      description: "Get AI-powered interview questions",
      color: "bg-orange-600"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 ${step.color} rounded-2xl text-white flex items-center justify-center text-3xl mb-4`}>
                  {step.icon}
                </div>
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-lg ${step.color} text-white flex items-center justify-center font-bold`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowDiagram;