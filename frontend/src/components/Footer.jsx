const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-black">InterviewPro</span>
            <span className="text-sm text-gray-500">AI</span>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <a href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
            <a href="/terms" className="text-sm text-gray-500 hover:text-gray-900">Terms of Service</a>
            <span className="text-sm text-gray-500">© {currentYear} InterviewPro AI. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;