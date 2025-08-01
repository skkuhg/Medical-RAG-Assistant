/**
 * Question card component for questionnaire steps
 */

'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface QuestionCardProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function QuestionCard({ children, title, subtitle }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-300">{subtitle}</p>
        )}
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
}