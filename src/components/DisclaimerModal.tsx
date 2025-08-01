/**
 * Disclaimer modal component that shows on first visit
 */

'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, AlertTriangle } from 'lucide-react';

export function DisclaimerModal() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen disclaimer before
    const hasSeenDisclaimer = localStorage.getItem('medcanvas-disclaimer-accepted');
    
    if (!hasSeenDisclaimer) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('medcanvas-disclaimer-accepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    // Redirect away from the application
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="glass-card p-8 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-500" />
              <h2 className="text-2xl font-bold text-white">Medical Disclaimer</h2>
            </div>
          </div>

          <div className="space-y-4 text-gray-300">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-red-300 font-semibold mb-2">IMPORTANT: READ CAREFULLY</h3>
                  <p className="text-sm text-red-200">
                    This platform is for educational purposes ONLY and should never be used as a substitute 
                    for professional medical advice, diagnosis, or treatment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">By using MedCanvas, you acknowledge and agree that:</h3>
              
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>
                    This AI-powered assessment tool is designed for educational and informational purposes only
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>
                    You should always consult with qualified healthcare professionals for medical concerns
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>
                    In case of emergency symptoms, you will seek immediate medical attention
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>
                    The AI-generated results may not be accurate and should not be relied upon for medical decisions
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>
                    No protected health information (PHI) is stored on our servers - all data remains local
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>
                    You will not use this platform to delay seeking appropriate medical care
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <h4 className="text-yellow-300 font-semibold mb-2">Emergency Situations</h4>
              <p className="text-sm text-yellow-200">
                If you are experiencing a medical emergency, please call your local emergency services 
                immediately (911 in the US) or go to the nearest emergency room. Do not use this platform 
                for emergency medical situations.
              </p>
            </div>
          </div>

          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleDecline}
              className="btn btn-outline btn-error flex-1"
            >
              I Do Not Agree
            </button>
            <button
              onClick={handleAccept}
              className="btn btn-primary bg-gradient-to-r from-pink-500 to-indigo-600 border-none text-white flex-1"
            >
              I Understand and Agree
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By clicking "I Understand and Agree", you acknowledge that you have read and understood 
            this disclaimer and agree to use this platform responsibly.
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}