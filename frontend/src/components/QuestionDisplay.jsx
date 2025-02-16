import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Download } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";

const CandidateInfoSection = ({ candidateInfo, showCandidateDetails, setShowCandidateDetails }) => (
  <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
    <button
      onClick={() => setShowCandidateDetails(!showCandidateDetails)}
      className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <h4 className="text-lg font-semibold text-gray-900">Candidate Profile</h4>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
            {candidateInfo.experience_years} YOE
          </span>
          <span className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
            {Array.isArray(candidateInfo.education) 
              ? candidateInfo.education[0] || 'N/A'
              : typeof candidateInfo.education === 'string' 
                ? candidateInfo.education
                : 'N/A'}
          </span>
        </div>
      </div>
      <span className="text-gray-500 text-xl font-medium">
        {showCandidateDetails ? '−' : '+'}
      </span>
    </button>
    
    {showCandidateDetails && (
      <div className="p-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-6">
            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-4">Personal Information</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.candidate_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Experience</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.experience_years} years</p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-500 mb-4">Contact Information</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.contact_info.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.contact_info.phone}</p>
                </div>
                {candidateInfo.contact_info.location && (
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-900 font-medium mt-1">{candidateInfo.contact_info.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-500 mb-4">Education</h5>
            <div className="space-y-4">
              {Array.isArray(candidateInfo.education) ? (
                candidateInfo.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    {typeof edu === 'object' ? (
                      <>
                        <p className="text-sm font-medium text-gray-900">{edu.degree}</p>
                        <p className="text-sm text-gray-600 mt-1">{edu.institution}</p>
                        <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                      </>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">{edu}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {candidateInfo.education || 'No education information available'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-500 mb-4">Skills & Expertise</h5>
          <div className="flex flex-wrap gap-2">
            {candidateInfo.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

const QuestionDisplay = ({ 
  questions, 
  jobDetails, 
  jobId,
  candidateInfo,
  matchScore,
  timestamp = new Date().toISOString(),
  showInitialPreview = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(!showInitialPreview);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [showMatchAnalysis, setShowMatchAnalysis] = useState(false);
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [animateCircles, setAnimateCircles] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (showMatchAnalysis) {
      // Force re-mount of the SVGs by updating the key, then trigger the animation.
      setAnimationKey(prev => prev + 1);
      setAnimateCircles(false);
      setTimeout(() => setAnimateCircles(true), 50);
    }
  }, [showMatchAnalysis]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadClick = () => {
    setShowDownloadDialog(true);
  };

  const handleDownload = async (includeAnswers) => {
    try {
      setShowDownloadDialog(false);
      setIsDownloading(true);
      const userEmail = localStorage.getItem('userEmail');
      const token = localStorage.getItem('token');

      if (!userEmail || !token || !jobId) {
        throw new Error('Missing required information for download');
      }

      const response = await fetch(
        `http://localhost:8000/report/${jobId}?user_email=${encodeURIComponent(userEmail)}&include_answers=${includeAnswers}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/pdf'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `interview_report_${jobId}${includeAnswers ? '_with_answers' : ''}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="bg-gray-50 p-6 border-b">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {jobDetails.jobTitle}
              </h3>
              <p className="text-sm text-gray-500 mt-2 flex items-center">
                <span className="inline-block mr-2">📅</span>
                Generated on {formatDate(timestamp)}
              </p>
            </div>
            {isExpanded && (
              <Button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 text-base font-medium transition-all duration-200 flex items-center gap-2 min-w-[160px] justify-center"
              >
                <Download size={18} />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
              </Button>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Experience Level</p>
              <p className="mt-1 text-gray-900 font-medium">{jobDetails.experienceLevel}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Interview Type</p>
              <p className="mt-1 text-gray-900 font-medium">{jobDetails.interviewType}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Key Skills</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {jobDetails.competencies.split(',').slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                    {skill.trim()}
                  </span>
                ))}
                {jobDetails.competencies.split(',').length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded">
                    +{jobDetails.competencies.split(',').length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="px-6 py-3 bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="p-6 space-y-6">
          <CandidateInfoSection 
            candidateInfo={candidateInfo}
            showCandidateDetails={showCandidateDetails}
            setShowCandidateDetails={setShowCandidateDetails}
          />

          {matchScore && (
            <div className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setShowMatchAnalysis(!showMatchAnalysis)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h4 className="text-lg font-semibold text-gray-900">Match Analysis</h4>
                <span className="text-gray-500">
                  {showMatchAnalysis ? '−' : '+'}
                </span>
              </button>
              
              {showMatchAnalysis && (
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    {/* Overall Match */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg key={animationKey} className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="6"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={
                              animateCircles
                                ? (2 * Math.PI * 45) - (2 * Math.PI * 45 * matchScore.overall_match / 100)
                                : (2 * Math.PI * 45)
                            }
                            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">{matchScore.overall_match}%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-600">Overall Match</p>
                    </div>

                    {/* Skills Match */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg key={animationKey + '_skill'} className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="6"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={
                              animateCircles
                                ? (2 * Math.PI * 45) - (2 * Math.PI * 45 * matchScore.skill_match / 100)
                                : (2 * Math.PI * 45)
                            }
                            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">{matchScore.skill_match}%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-600">Skills Match</p>
                    </div>

                    {/* Experience Match */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-24 h-24">
                        <svg key={animationKey + '_exp'} className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="45"
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="6"
                            strokeDasharray={2 * Math.PI * 45}
                            strokeDashoffset={
                              animateCircles
                                ? (2 * Math.PI * 45) - (2 * Math.PI * 45 * matchScore.experience_match / 100)
                                : (2 * Math.PI * 45)
                            }
                            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-gray-900">{matchScore.experience_match}%</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-600">Experience Match</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isExpanded ? (
            <div className="text-center py-4">
              <Button
                onClick={() => setIsExpanded(true)}
                className="bg-black text-white hover:bg-gray-800 px-8 py-2 text-sm font-medium rounded-md transition-all duration-200"
              >
                View Questions
              </Button>
            </div>
          ) : (
            <div className="transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-xl font-bold text-gray-900">
                  Generated Questions ({questions.length})
                </h4>
                {showInitialPreview && (
                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="outline"
                    className="text-gray-600 hover:text-gray-900 border border-gray-300 text-sm font-medium rounded-md"
                  >
                    Hide Questions
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                  >
                    <div className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-800 pt-1">{question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md p-6 rounded-lg bg-white shadow-lg">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Download Interview Report
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2 text-sm">
              Choose whether to include AI-generated sample answers in your report.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2 py-2">
            <Button
              onClick={() => handleDownload(false)}
              className="flex items-center justify-center w-full h-12 border border-gray-300 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition text-sm font-medium"
              disabled={isDownloading}
            >
              Questions Only
            </Button>
            <Button
              onClick={() => handleDownload(true)}
              className="flex items-center justify-center w-full h-12 border border-gray-900 bg-black text-white rounded-md hover:bg-gray-800 transition text-sm font-medium"
              disabled={isDownloading}
            >
              With Answers
            </Button>
          </div>

          {isDownloading && (
            <div className="flex items-center justify-center mt-2">
              <div className="animate-spin h-6 w-6 border-4 border-gray-300 border-t-black rounded-full"></div>
              <span className="ml-2 text-sm text-gray-500">Generating report...</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuestionDisplay;
