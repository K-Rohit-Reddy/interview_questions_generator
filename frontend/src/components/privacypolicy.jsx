import React from 'react';

const PrivacyPolicy = () => {
  return (
    <>
    <br /><br /><br /><br />
    <div className="max-w-4xl mx-auto px-4 py-10">
          <h1 className="text-4xl font-bold mb-10 text-center">Privacy Policy</h1>
          <div className="space-y-8">
              <section>
                  <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-gray-700 leading-relaxed">
                      Welcome to InterviewPro AI. We respect your privacy and are committed to protecting your personal data.
                      This privacy policy explains how we collect, use, and safeguard your information when you use our service.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed">
                      We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-2">
                      <li>Account information (name, email address, professional background)</li>
                      <li>Interview practice responses and interactions</li>
                      <li>Usage data and analytics</li>
                      <li>Communication preferences</li>
                  </ul>
              </section>

              <section>
                  <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                      We use your information to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-2">
                      <li>Provide and improve our interview preparation services</li>
                      <li>Personalize your experience and content</li>
                      <li>Analyze usage patterns to enhance our platform</li>
                      <li>Communicate with you about our services</li>
                  </ul>
              </section>

              <section>
                  <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                      We implement appropriate security measures to protect your personal information. Your data is encrypted in transit and at rest,
                      and we regularly review our security practices.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed">
                      You have the right to:
                  </p>
                  <ul className="list-disc ml-6 mt-2 text-gray-700 space-y-2">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate data</li>
                      <li>Request deletion of your data</li>
                      <li>Opt-out of marketing communications</li>
                  </ul>
              </section>

              <section>
                  <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed">
                      If you have questions about this privacy policy or our practices, please contact us at privacy@interviewpro.ai.
                  </p>
              </section>

              <section>
                  <h2 className="text-2xl font-semibold mb-4">7. Updates to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                      We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
                  </p>
              </section>

              <p className="text-center text-gray-500 mt-6">Last updated: February 17, 2025</p>
          </div>
      </div></>
  );
};

export default PrivacyPolicy;
