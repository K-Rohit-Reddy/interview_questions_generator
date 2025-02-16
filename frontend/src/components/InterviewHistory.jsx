import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import Header from './Header';
import QuestionDisplay from './QuestionDisplay';
import LoadingAnimation from './LoadingAnimation';
import Footer from './Footer';

const InterviewHistory = ({ onLogout }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');
        if (!userEmail || !token) {
          navigate('/login');
          return;
        }
        const response = await fetch(`https://interviewquestionsgenerator-production.up.railway.app/history/${userEmail}`, {

          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        const sortedHistory = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setHistory(Array.isArray(sortedHistory) ? sortedHistory : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={onLogout} />
        <div className="max-w-6xl mx-auto px-4 py-20">
        <LoadingAnimation message="Fetching Interview History..." />
        </div>
      </div>
    );
  }

  return (
    <><br /><div className="min-h-screen bg-white">
      <Header onLogout={onLogout} />
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview History</h1>
          <p className="mt-2 text-gray-600">View your past interview assessments</p>
        </div>
        {error && (
          <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-md border border-red-200">
            {error}
          </div>
        )}
        {history.length == 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Interview History</h3>
            <p className="text-gray-500 mb-6">
              Your interview history will appear here once you generate questions.
            </p>
            <Button
              onClick={() => navigate('/generate')}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-md transition-colors"
            >
              Generate Questions
            </Button>
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
                  interviewType: entry.interview_type,
                }}
                jobId={entry.job_id}
                deleteId={entry._id} // Pass unique deletion id
                candidateInfo={entry.candidate_info}
                matchScore={entry.match_score}
                timestamp={entry.timestamp}
                showInitialPreview={true}
                menuType="menu" />
            ))}
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default InterviewHistory;
