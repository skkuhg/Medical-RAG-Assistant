'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedHeader } from '@/components/AnimatedHeader';
import { Activity, Shield, Clock, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <AnimatedHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-12"
        >
          <div className="glass-card p-8 mb-8">
            <div className="text-center mb-8">
              <motion.p
                className="text-lg text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Experience the future of medical assessment with our AI-powered platform
              </motion.p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/questionnaire"
                  className="btn btn-primary btn-lg text-white bg-gradient-to-r from-pink-500 to-indigo-600 border-none hover:from-pink-600 hover:to-indigo-700 shadow-lg"
                >
                  Start Assessment
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                icon: Activity,
                title: "Advanced AI",
                description: "Powered by GPT-4 and real-time medical data"
              },
              {
                icon: Shield,
                title: "Privacy First",
                description: "No PHI stored, all data stays local"
              },
              {
                icon: Clock,
                title: "Real-time",
                description: "Instant analysis with up-to-date guidelines"
              },
              {
                icon: Users,
                title: "Educational",
                description: "Supplement to professional medical advice"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <feature.icon className="w-8 h-8 mx-auto mb-4 text-indigo-400" />
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="glass-card p-6 text-center"
          >
            <div className="alert alert-warning">
              <Shield className="w-6 h-6" />
              <span>
                <strong>Medical Disclaimer:</strong> This platform is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers.
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
