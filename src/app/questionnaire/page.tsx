/**
 * Questionnaire page with multi-step form
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Stepper } from '@/components/Stepper';
import { QuestionCard } from '@/components/QuestionCard';
import { PatientData, QuestionnaireStep } from '@/types/medical';
import { ArrowLeft, ArrowRight, User, Heart, Clock, Pill, AlertTriangle } from 'lucide-react';

const steps: QuestionnaireStep[] = [
  { id: 1, title: "Basic Information", description: "Tell us about yourself", completed: false },
  { id: 2, title: "Chief Complaint", description: "What's bothering you?", completed: false },
  { id: 3, title: "Symptoms", description: "Describe your symptoms", completed: false },
  { id: 4, title: "Duration & Severity", description: "When did it start?", completed: false },
  { id: 5, title: "Medical History", description: "Medications and allergies", completed: false },
];

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Shortness of breath", "Chest pain", "Nausea",
  "Vomiting", "Diarrhea", "Fatigue", "Dizziness", "Joint pain", "Muscle pain",
  "Sore throat", "Runny nose", "Abdominal pain", "Back pain"
];

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<PatientData>>({
    symptoms: [],
    medications: [],
    allergies: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('diagnosis-result', JSON.stringify(result));
        router.push('/results');
      } else {
        throw new Error('Failed to process diagnosis');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to process your assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <QuestionCard 
            title="Basic Information" 
            subtitle="Help us understand your background"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full bg-white/5 text-white"
                  placeholder="Enter your age"
                  value={formData.age || ''}
                  onChange={(e) => updateFormData('age', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sex
                </label>
                <select
                  className="select select-bordered w-full bg-white/5 text-white [&>option]:bg-gray-800 [&>option]:text-white"
                  value={formData.sex || ''}
                  onChange={(e) => updateFormData('sex', e.target.value)}
                >
                  <option value="" className="bg-gray-800 text-white">Select</option>
                  <option value="male" className="bg-gray-800 text-white">Male</option>
                  <option value="female" className="bg-gray-800 text-white">Female</option>
                  <option value="other" className="bg-gray-800 text-white">Other</option>
                </select>
              </div>
            </div>
            
            {formData.sex === 'female' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pregnancy Status
                </label>
                <select
                  className="select select-bordered w-full bg-white/5 text-white [&>option]:bg-gray-800 [&>option]:text-white"
                  value={formData.pregnancyStatus || ''}
                  onChange={(e) => updateFormData('pregnancyStatus', e.target.value)}
                >
                  <option value="" className="bg-gray-800 text-white">Select</option>
                  <option value="no" className="bg-gray-800 text-white">No</option>
                  <option value="yes" className="bg-gray-800 text-white">Yes</option>
                  <option value="possible" className="bg-gray-800 text-white">Possible</option>
                </select>
              </div>
            )}
          </QuestionCard>
        );

      case 1:
        return (
          <QuestionCard 
            title="Chief Complaint" 
            subtitle="What's your main concern today?"
          >
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Describe your main concern
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-32 bg-white/5 text-white"
                placeholder="Please describe what's bothering you most..."
                value={formData.chiefComplaint || ''}
                onChange={(e) => updateFormData('chiefComplaint', e.target.value)}
              />
            </div>
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard 
            title="Symptoms" 
            subtitle="Select all symptoms you're experiencing"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {commonSymptoms.map((symptom) => (
                <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={formData.symptoms?.includes(symptom) || false}
                    onChange={(e) => {
                      const symptoms = formData.symptoms || [];
                      if (e.target.checked) {
                        updateFormData('symptoms', [...symptoms, symptom]);
                      } else {
                        updateFormData('symptoms', symptoms.filter(s => s !== symptom));
                      }
                    }}
                  />
                  <span className="text-gray-300 text-sm">{symptom}</span>
                </label>
              ))}
            </div>
          </QuestionCard>
        );

      case 3:
        return (
          <QuestionCard 
            title="Duration & Severity" 
            subtitle="When did symptoms start and how severe are they?"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How long have you had these symptoms?
                </label>
                <select
                  className="select select-bordered w-full bg-white/5 text-white [&>option]:bg-gray-800 [&>option]:text-white"
                  value={formData.duration || ''}
                  onChange={(e) => updateFormData('duration', e.target.value)}
                >
                  <option value="" className="bg-gray-800 text-white">Select duration</option>
                  <option value="less-than-1-day" className="bg-gray-800 text-white">Less than 1 day</option>
                  <option value="1-3-days" className="bg-gray-800 text-white">1-3 days</option>
                  <option value="4-7-days" className="bg-gray-800 text-white">4-7 days</option>
                  <option value="1-2-weeks" className="bg-gray-800 text-white">1-2 weeks</option>
                  <option value="2-4-weeks" className="bg-gray-800 text-white">2-4 weeks</option>
                  <option value="more-than-1-month" className="bg-gray-800 text-white">More than 1 month</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Severity (1 = mild, 5 = severe)
                </label>
                <div className="rating rating-lg">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <input
                      key={rating}
                      type="radio"
                      className="mask mask-star-2 bg-orange-400"
                      checked={formData.severity === rating}
                      onChange={() => updateFormData('severity', rating)}
                    />
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Current rating: {formData.severity || 'Not selected'}
                </p>
              </div>
            </div>
          </QuestionCard>
        );

      case 4:
        return (
          <QuestionCard 
            title="Medical History" 
            subtitle="Current medications and known allergies"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Medications (one per line)
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24 bg-white/5 text-white"
                  placeholder="List your current medications..."
                  value={formData.medications?.join('\n') || ''}
                  onChange={(e) => updateFormData('medications', e.target.value.split('\n').filter(m => m.trim()))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Known Allergies (one per line)
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24 bg-white/5 text-white"
                  placeholder="List any known allergies..."
                  value={formData.allergies?.join('\n') || ''}
                  onChange={(e) => updateFormData('allergies', e.target.value.split('\n').filter(a => a.trim()))}
                />
              </div>
            </div>
          </QuestionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Stepper steps={steps} currentStep={currentStep} />
        
        <AnimatePresence mode="wait">
          <motion.div key={currentStep}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="btn btn-ghost text-white disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="btn btn-primary bg-gradient-to-r from-pink-500 to-indigo-600 border-none text-white"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : currentStep === steps.length - 1 ? (
              'Submit Assessment'
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}