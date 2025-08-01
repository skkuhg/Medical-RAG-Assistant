/**
 * Diagnosis tabs component for results display
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiagnosisResult } from '@/types/medical';
import { RxTable } from './RxTable';
import { FileText, Pill, AlertTriangle, ExternalLink } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DiagnosisTabsProps {
  result: DiagnosisResult;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

export function DiagnosisTabs({ result }: DiagnosisTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, name: 'Diagnosis', icon: FileText },
    { id: 1, name: 'Prescription', icon: Pill },
    { id: 2, name: 'Safety', icon: AlertTriangle },
  ];

  const chartData = result.probable_conditions.map((condition, index) => ({
    name: condition,
    value: Math.floor(Math.random() * 30) + 20, // Mock confidence scores
    color: COLORS[index % COLORS.length]
  }));

  const isEmergency = result.safety_flags.toLowerCase().includes('emergency') || 
                     result.safety_flags.toLowerCase().includes('call');

  return (
    <div className="glass-card p-8">
      {/* Conditions Chart */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Probable Conditions</h3>
        <div className="bg-white/5 rounded-lg p-4" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered mb-6">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={`tab tab-bordered ${
              activeTab === tab.id ? 'tab-active text-white' : 'text-gray-400'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="w-4 h-4 mr-2" />
            {tab.name}
          </a>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 0 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Probable Conditions</h4>
                <div className="space-y-2">
                  {result.probable_conditions.map((condition, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3">
                      <span className="text-gray-300">{condition}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Recommended Tests</h4>
                <div className="space-y-2">
                  {result.recommended_tests?.map((test, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3">
                      <span className="text-gray-300">{test}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.sources && result.sources.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Medical Sources</h4>
                  <div className="space-y-2">
                    {result.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-indigo-400" />
                        <span className="text-gray-300 text-sm truncate">{source}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Prescription Draft</h4>
              <RxTable prescriptions={result.rx} />
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Safety Information</h4>
              <div 
                className={`p-6 rounded-lg ${
                  isEmergency 
                    ? 'bg-red-500/20 border border-red-500/50 shadow-red-500/20 shadow-lg' 
                    : 'bg-yellow-500/20 border border-yellow-500/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <AlertTriangle 
                    className={`w-6 h-6 mt-1 ${
                      isEmergency ? 'text-red-400' : 'text-yellow-400'
                    }`} 
                  />
                  <div>
                    <p className="text-white font-medium mb-2">
                      {isEmergency ? 'EMERGENCY ALERT' : 'Important Safety Information'}
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      {result.safety_flags}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}