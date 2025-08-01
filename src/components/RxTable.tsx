/**
 * Prescription table component with edit and export functionality
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Prescription } from '@/types/medical';
import { Edit3, Save, X, Download, Printer } from 'lucide-react';
import jsPDF from 'jspdf';

interface RxTableProps {
  prescriptions: Prescription[];
}

export function RxTable({ prescriptions: initialPrescriptions }: RxTableProps) {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Prescription | null>(null);

  const handleEdit = (index: number) => {
    setEditingId(index);
    setEditData({ ...prescriptions[index] });
  };

  const handleSave = () => {
    if (editingId !== null && editData) {
      const updated = [...prescriptions];
      updated[editingId] = editData;
      setPrescriptions(updated);
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData(null);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('MedCanvas - Prescription Draft', 20, 30);
    
    doc.setFontSize(12);
    doc.text('Generated: ' + new Date().toLocaleDateString(), 20, 45);
    doc.text('DISCLAIMER: This is a draft prescription for educational purposes only.', 20, 55);
    doc.text('Please consult with a licensed healthcare provider for actual prescriptions.', 20, 65);
    
    let yPosition = 85;
    
    prescriptions.forEach((rx, index) => {
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${rx.drug}`, 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.text(`Dosage: ${rx.dosage}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Frequency: ${rx.frequency}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Duration: ${rx.duration}`, 30, yPosition);
      yPosition += 10;
      if (rx.notes) {
        doc.text(`Notes: ${rx.notes}`, 30, yPosition);
        yPosition += 10;
      }
      yPosition += 10;
    });
    
    doc.save('medcanvas-prescription-draft.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  if (prescriptions.length === 0) {
    return (
      <div className="bg-white/5 rounded-lg p-8 text-center">
        <p className="text-gray-400">No prescription recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Export Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={exportToPDF}
          className="btn btn-sm btn-outline text-white border-white/20 hover:bg-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </button>
        <button
          onClick={handlePrint}
          className="btn btn-sm btn-outline text-white border-white/20 hover:bg-white/10"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print
        </button>
      </div>

      {/* Prescription Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full bg-white/5">
          <thead>
            <tr className="text-white">
              <th>Drug</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((prescription, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-300"
              >
                {editingId === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="input input-sm w-full bg-white/10 text-white"
                        value={editData?.drug || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, drug: e.target.value } : null)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-sm w-full bg-white/10 text-white"
                        value={editData?.dosage || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, dosage: e.target.value } : null)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-sm w-full bg-white/10 text-white"
                        value={editData?.frequency || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, frequency: e.target.value } : null)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input input-sm w-full bg-white/10 text-white"
                        value={editData?.duration || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, duration: e.target.value } : null)}
                      />
                    </td>
                    <td>
                      <textarea
                        className="textarea textarea-sm w-full bg-white/10 text-white"
                        value={editData?.notes || ''}
                        onChange={(e) => setEditData(prev => prev ? { ...prev, notes: e.target.value } : null)}
                      />
                    </td>
                    <td>
                      <div className="flex space-x-1">
                        <button
                          onClick={handleSave}
                          className="btn btn-xs btn-success"
                        >
                          <Save className="w-3 h-3" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="btn btn-xs btn-error"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="font-medium">{prescription.drug}</td>
                    <td>{prescription.dosage}</td>
                    <td>{prescription.frequency}</td>
                    <td>{prescription.duration}</td>
                    <td className="max-w-xs truncate">{prescription.notes}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(index)}
                        className="btn btn-xs btn-ghost text-indigo-400 hover:bg-indigo-400/20"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
        <p className="text-yellow-200 text-sm">
          <strong>Important:</strong> This is a draft prescription for educational purposes only. 
          Please consult with a licensed healthcare provider for actual prescriptions and medical advice.
        </p>
      </div>
    </div>
  );
}