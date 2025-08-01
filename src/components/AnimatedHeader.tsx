/**
 * Animated header component with glass-morphism design
 */

'use client';

import { motion } from 'framer-motion';
import { Stethoscope, Heart } from 'lucide-react';

export function AnimatedHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden"
    >
      <div className="animated-gradient absolute inset-0 opacity-20"></div>
      <div className="glass-card p-8 text-center relative z-10">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block mb-4"
        >
          <Stethoscope className="w-16 h-16 text-indigo-600" />
        </motion.div>
        
        <motion.h1
          className="text-6xl font-bold gradient-text mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          MedCanvas
        </motion.h1>
        
        <motion.p
          className="text-xl text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          AI-Powered Medical Assessment Platform
        </motion.p>
        
        <motion.div
          className="flex justify-center items-center space-x-2 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Heart className="w-4 h-4 text-red-500" />
          <span>Powered by Advanced Medical AI</span>
        </motion.div>
      </div>
    </motion.div>
  );
}