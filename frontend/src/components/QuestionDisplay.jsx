import { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Download } from 'lucide-react';

const QuestionDisplay = ({ 
  questions, 
  jobDetails, 
  jobId,
  candidateInfo,
  timestamp = new Date().toISOString(),
  showInitialPreview = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(!showInitialPreview);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = async (includeAnswers) => {
    try {
      setIsDownloading(true);
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch(
        `http://localhost:8000/report/${jobId}?user_email=${userEmail}&include_answers=${includeAnswers}`
      );
      
      if (!response.ok) throw new Error('Failed to download report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview_questions_${jobId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download PDF. Please try again.');
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const promptDownload = () => {
    setShowModal(true);
  };

  const handleModalClose = (includeAnswers) => {
    setShowModal(false);
    if (includeAnswers !== null) {
      handleDownload(includeAnswers);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-slate-50 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">
              {jobDetails.jobTitle}
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Generated on {formatDate(timestamp)}
            </p>
          </div>
          <Button
            onClick={promptDownload}
            disabled={isDownloading}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-md 
              shadow-sm transition-all duration-200 flex items-center gap-2 
              min-w-[160px] justify-center font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Experience Level</p>
            <p className="text-slate-900">{jobDetails.experienceLevel}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Interview Type</p>
            <p className="text-slate-900">{jobDetails.interviewType}</p>
          </div>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <p className="text-sm font-medium text-slate-600">Key Skills</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {jobDetails.competencies.split(',').slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded-full"
                >
                  {skill.trim()}
                </span>
              ))}
              {jobDetails.competencies.split(',').length > 3 && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">
                  +{jobDetails.competencies.split(',').length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {error && (
        <div className="px-6 py-3 bg-red-50 text-red-600 text-sm border-l-4 border-red-500">
          {error}
        </div>
      )}

      <CardContent className="p-6 space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-slate-900 mb-4">Candidate Information</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Name</p>
              <p className="font-medium">{candidateInfo.name}</p>
            </div>
            <div>
              <p className="text-slate-600">Email</p>
              <p className="font-medium">{candidateInfo.contact_info.email}</p>
            </div>
            <div>
              <p className="text-slate-600">Phone</p>
              <p className="font-medium">{candidateInfo.contact_info.phone}</p>
            </div>
            <div>
              <p className="text-slate-600">Experience</p>
              <p className="font-medium">{candidateInfo.experience_years} years</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-600">Education</p>
              <p className="font-medium">{candidateInfo.education.join(', ')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-600">Skills</p>
              <p className="font-medium">{candidateInfo.skills.join(', ')}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-slate-600">Professional Summary</p>
              <p className="font-medium">{candidateInfo.professional_summary}</p>
            </div>
          </div>
        </div>

        {!isExpanded ? (
          <div className="text-center py-4">
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-black hover:bg-gray-800 text-white px-8 py-2.5 rounded-md
                shadow-sm transition-all duration-200 font-medium text-sm
                min-w-[140px] hover:shadow-md active:transform active:scale-95"
            >
              View Questions
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-slate-900">
                Interview Questions ({questions.length})
              </h4>
              {showInitialPreview && (
                <Button
                  onClick={() => setIsExpanded(false)}
                  className="border-2 border-gray-300 hover:border-gray-400 text-gray-700
                    hover:text-gray-900 px-6 py-2 rounded-md shadow-sm transition-all
                    duration-200 font-medium text-sm bg-white hover:bg-gray-50"
                >
                  Hide Questions
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 
                    transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-black text-white 
                      rounded-full flex items-center justify-center font-medium text-sm
                      shadow-sm"
                    >
                      {index + 1}
                    </span>
                    <p className="text-gray-800 pt-1.5">{question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">Include Answers?</h3>
            <p className="text-gray-600 mb-6">Do you want to include answers in the report?</p>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => handleModalClose(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                No
              </Button>
              <Button
                onClick={() => handleModalClose(true)}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QuestionDisplay;