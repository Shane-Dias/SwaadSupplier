import React, { useState } from 'react';
import { Send, CheckCircle, X } from 'lucide-react';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    setShowPopup(true);
    
    // Reset form after showing popup
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-orange-500/8 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-red-500/8 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl" />
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-white/20 rounded-lg p-6 max-w-sm w-full mx-4 relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">Thank you!</h3>
              <p className="text-white/70 mb-4">Your feedback has been submitted successfully.</p>
              <button
                onClick={closePopup}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-yellow-200 to-red-300">
            Feedback Form
          </span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Message</label>
            <textarea
              required
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all resize-none"
              placeholder="Your feedback..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 font-medium"
          >
            <Send size={16} />
            Submit Your Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;