import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";
import Header from './Header';
import QuestionDisplay from './QuestionDisplay';
import LoadingAnimation from './LoadingAnimation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

const InterviewHistory = ({ onLogout }) => {
  // State management
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();

  // Fetch interview history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');

        if (!userEmail || !token) {
          navigate('/login');
          return;
        }

        const response = await fetch(
          `http://localhost:8000/history/${userEmail}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

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
        // Sort history by timestamp in descending order
        const sortedHistory = data.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        setHistory(Array.isArray(sortedHistory) ? sortedHistory : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  // Handle report download
  const handleDownload = async (includeAnswers) => {
    try {
      setShowDownloadDialog(false);
      setIsDownloading(true);
      setError(null); // Reset any previous errors
      
      const userEmail = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');

      if (!userEmail || !token || !selectedJobId) {
        throw new Error('Missing required information for download');
      }

      const response = await fetch(
        `http://localhost:8000/report/${selectedJobId}?user_email=${encodeURIComponent(userEmail)}&include_answers=${includeAnswers}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Check for non-OK response
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.detail || 'Failed to download report');
        } catch {
          throw new Error(errorText || 'Failed to download report');
        }
      }

      // Get the filename from the Content-Disposition header if present
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `interview_report_${selectedJobId}${includeAnswers ? '_with_answers' : ''}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      // Create and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      // Cleanup after a short delay
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

    } catch (err) {
      console.error('Download error:', err);
      setError(`Failed to download PDF: ${err.message}`);
      setShowDownloadDialog(false);
    } finally {
      setIsDownloading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={onLogout} />
        <div className="max-w-6xl mx-auto px-4 py-20">
          <LoadingAnimation />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
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

          {history.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="mb-4 text-4xl">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Interview History</h3>
              <p className="text-gray-500 mb-6">
                Your interview history will appear here once you generate questions.
              </p>
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
                  candidateInfo={entry.candidate_info}
                  matchScore={entry.match_score}
                  timestamp={entry.timestamp}
                  showInitialPreview={true}
                  onDownloadClick={() => {
                    setSelectedJobId(entry.job_id);
                    setShowDownloadDialog(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-black">
              Download Interview Report
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Choose your preferred report format. Including answers will provide AI-generated sample responses.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={() => handleDownload(false)}
              className="w-full bg-white border-2 border-black text-black hover:bg-gray-50 font-medium"
              disabled={isDownloading}
            >
              Questions Only
            </Button>
            <Button
              onClick={() => handleDownload(true)}
              className="w-full bg-black text-white hover:bg-gray-800 font-medium"
              disabled={isDownloading}
            >
              Include Answers
            </Button>
          </div>
          {isDownloading && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <span className="ml-3 text-sm text-gray-600">
                Generating your report...
              </span>
            </div>
          )}
          <DialogFooter className="mt-6">
            <Button
              onClick={() => setShowDownloadDialog(false)}
              className="w-full sm:w-auto border-black text-black hover:bg-gray-50"
              disabled={isDownloading}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InterviewHistory;