/**
 * Stepper component for questionnaire navigation
 */

'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { QuestionnaireStep } from '@/types/medical';

interface StepperProps {
  steps: QuestionnaireStep[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="glass-card p-6 mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-full
                ${index <= currentStep 
                  ? 'bg-gradient-to-r from-pink-500 to-indigo-600 text-white' 
                  : 'bg-gray-300 text-gray-600'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: index === currentStep ? 1.1 : 1,
                backgroundColor: index <= currentStep ? '#6366f1' : '#d1d5db'
              }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </motion.div>
            
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-16 h-1 mx-2
                  ${index < currentStep ? 'bg-indigo-500' : 'bg-gray-300'}
                `}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-white">
          {steps[currentStep]?.title}
        </h3>
        <p className="text-gray-300 text-sm mt-1">
          {steps[currentStep]?.description}
        </p>
      </div>
      
      <div className="mt-4">
        <div className="w-full bg-gray-300 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-pink-500 to-indigo-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}