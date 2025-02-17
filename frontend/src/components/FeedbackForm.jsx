import { useState } from "react";
import config from '../config';
const FeedbackForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear errors when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${config.api.baseUrl}${config.api.endpoints.feedback.submit}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to submit feedback.");

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setSubmitted(false), 5000); // Hide success message after 5s
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <><br /><br /><br /><br /><br /><div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Send us your Feedback</h2>

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          {submitted && <p className="text-green-600 text-sm mb-3">Thank you! Your feedback has been received.</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                  <label className="block text-gray-700 font-medium">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300" placeholder="Your Name" />
              </div>

              <div>
                  <label className="block text-gray-700 font-medium">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300" placeholder="Your Email" />
              </div>

              <div>
                  <label className="block text-gray-700 font-medium">Message</label>
                  <textarea name="message" value={formData.message} onChange={handleChange}
                      className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300" rows="4"
                      placeholder="Your feedback..." />
              </div>

              <button type="submit" className="w-full bg-black text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  Submit Feedback
              </button>
          </form>
      </div></>
  );
};

export default FeedbackForm;
