import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Download } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';
import QuestionDisplay from './QuestionDisplay';  // Import the separate component

const QuestionForm = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    experienceLevel: '',
    competencies: '',
    interviewType: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState(null);
  const [jobId, setJobId] = useState(null);  // Add this state
  const [showModal, setShowModal] = useState(false);  // State to control modal visibility
  const [candidateInfo, setCandidateInfo] = useState(null); // Add this state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataObj = new FormData();
      formDataObj.append('user_email', localStorage.getItem('userEmail'));
      formDataObj.append('job_title', formData.jobTitle);
      formDataObj.append('job_description', formData.jobDescription);
      formDataObj.append('experience_level', formData.experienceLevel);
      formDataObj.append('competencies', formData.competencies);
      formDataObj.append('interview_type', formData.interviewType);
      if (file) {
        formDataObj.append('candidate_resume', file);
      }

      const response = await fetch('http://localhost:8000/questions/generate_questions', {
        method: 'POST',
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate questions');
      }

      const data = await response.json();
      if (data && data.questions && data.candidate_info) {
        setQuestions(data.questions);
        setJobId(data.job_id);
        setCandidateInfo(data.candidate_info); // Store the complete candidate info
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (includeAnswers) => {
    try {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {!loading && !questions && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Generate Interview Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded border border-red-200">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <Input
                    required
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Job Description
                  </label>
                  <textarea
                    required
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                    rows={4}
                    placeholder="Enter detailed job description"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Experience Level
                  </label>
                  <select
                    required
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry">Entry Level</option>
                    <option value="Mid">Mid Level</option>
                    <option value="Senior">Senior Level</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Competencies (comma-separated)
                  </label>
                  <Input
                    required
                    value={formData.competencies}
                    onChange={(e) => setFormData({...formData, competencies: e.target.value})}
                    placeholder="e.g. Python, React, AWS"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Interview Type
                  </label>
                  <select
                    required
                    value={formData.interviewType}
                    onChange={(e) => setFormData({...formData, interviewType: e.target.value})}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select interview type</option>
                    <option value="Technical">Technical</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Upload Resume
                  </label>
                  <Input
                    type="file"
                    required
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".pdf,.docx"
                    className="w-full"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
                >
                  {loading ? 'Generating Questions...' : 'Generate Questions'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingAnimation />}

        {questions && !loading && (
          <QuestionDisplay 
            questions={questions}
            jobDetails={{
              jobTitle: formData.jobTitle,
              jobDescription: formData.jobDescription,
              experienceLevel: formData.experienceLevel,
              competencies: formData.competencies,
              interviewType: formData.interviewType
            }}
            jobId={jobId}
            candidateInfo={candidateInfo} // Use the parsed candidate info from backend
            timestamp={new Date().toISOString()}
            showInitialPreview={true}
          />
        )}

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
      </div>
    </div>
  );
};

export default QuestionForm;