/**
 * Results page displaying diagnosis and prescription information
 */

'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DiagnosisTabs } from '@/components/DiagnosisTabs';
import { DiagnosisResult } from '@/types/medical';
import { ArrowLeft, RefreshCw, Home } from 'lucide-react';

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get result from localStorage
    const storedResult = localStorage.getItem('diagnosis-result');
    
    if (storedResult) {
      try {
        setResult(JSON.parse(storedResult));
      } catch (error) {
        console.error('Error parsing stored result:', error);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleNewAssessment = () => {
    localStorage.removeItem('diagnosis-result');
    router.push('/questionnaire');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="loading loading-spinner loading-lg text-indigo-400"></div>
          <p className="text-white mt-4">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">No Results Found</h2>
          <p className="text-gray-300 mb-6">
            We couldn't find any assessment results. Please complete the questionnaire first.
          </p>
          <Link
            href="/questionnaire"
            className="btn btn-primary bg-gradient-to-r from-pink-500 to-indigo-600 border-none text-white"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Assessment Results</h1>
              <p className="text-gray-300 mt-2">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Link
                href="/"
                className="btn btn-ghost text-white hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Link>
              <button
                onClick={handleNewAssessment}
                className="btn btn-primary bg-gradient-to-r from-pink-500 to-indigo-600 border-none text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Assessment
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DiagnosisTabs result={result} />
        </motion.div>

        {/* Footer Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass-card p-6"
        >
          <div className="alert alert-info">
            <div className="flex">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-bold">Medical Disclaimer</h3>
                <div className="text-sm mt-2">
                  <p>
                    This assessment is powered by artificial intelligence and is intended for educational 
                    purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment.
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Always consult with qualified healthcare providers for medical concerns</li>
                    <li>Seek immediate medical attention for emergency symptoms</li>
                    <li>Do not use this assessment to delay professional medical care</li>
                    <li>Results are based on AI analysis and may not be accurate</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}