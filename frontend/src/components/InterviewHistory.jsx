import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import Header from './Header';
import QuestionDisplay from './QuestionDisplay';
import LoadingAnimation from './LoadingAnimation';

const InterviewHistory = ({ onLogout }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const response = await fetch(`http://localhost:8000/history/${userEmail}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        
        const data = await response.json();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadReport = async (jobId) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(`http://localhost:8000/report/${jobId}?user_email=${userEmail}`);
      
      if (!response.ok) throw new Error('Failed to download report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview_report_${jobId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <LoadingAnimation />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout} /> {/* Pass onLogout to Header */}
      
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
          <p className="mt-2 text-gray-600">View your past interview question generations</p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}

        {history.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No interview history found. Start by generating some questions!
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((entry) => (
              <QuestionDisplay
                key={entry.job_id}
                questions={entry.questions}
                jobDetails={{
                  jobTitle: entry.job_title,
                  jobDescription: entry.job_description,
                  experienceLevel: entry.experience_level,
                  competencies: Array.isArray(entry.competencies) 
                    ? entry.competencies.join(', ')
                    : entry.competencies,
                  interviewType: entry.interview_type
                }}
                jobId={entry.job_id}
                candidateInfo={entry.candidate_info}  // Pass candidate info
                timestamp={entry.timestamp}
                showInitialPreview={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;