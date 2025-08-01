/**
 * API route for medical diagnosis with RAG functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchMedicalInfo, formatMedicalContext, extractSources } from '@/lib/tavily';
import { createDiagnosis, withRetry } from '@/lib/openai';
import { PatientData, DiagnosisResult } from '@/types/medical';

export async function POST(request: NextRequest) {
  try {
    const patientData: PatientData = await request.json();
    
    // Validate required fields
    if (!patientData.chiefComplaint || !patientData.age || !patientData.sex) {
      return NextResponse.json(
        { error: 'Missing required patient information' },
        { status: 400 }
      );
    }

    // Check for emergency symptoms
    const emergencySymptoms = [
      'chest pain', 'difficulty breathing', 'shortness of breath',
      'severe allergic reaction', 'anaphylaxis', 'loss of consciousness',
      'severe head injury', 'stroke symptoms', 'heart attack'
    ];
    
    const hasEmergencySymptoms = emergencySymptoms.some(symptom =>
      patientData.chiefComplaint.toLowerCase().includes(symptom) ||
      patientData.symptoms?.some(s => s.toLowerCase().includes(symptom))
    );

    // Perform Tavily search for medical context
    const searchQuery = `${patientData.chiefComplaint} ${patientData.symptoms?.join(' ')}`;
    
    const tavilyResult = await withRetry(async () => {
      return await searchMedicalInfo(searchQuery);
    });

    const medicalContext = formatMedicalContext(tavilyResult);
    const sources = extractSources(tavilyResult);

    // Generate diagnosis using OpenAI
    const diagnosis = await withRetry(async () => {
      return await createDiagnosis(patientData, medicalContext);
    });

    // Force emergency flag if needed
    if (hasEmergencySymptoms && !diagnosis.safety_flags.includes('EMERGENCY')) {
      diagnosis.safety_flags = "CALL EMERGENCY SERVICES IMMEDIATELY - " + diagnosis.safety_flags;
    }

    // Add medical disclaimer
    if (!diagnosis.safety_flags.includes('educational')) {
      diagnosis.safety_flags += ". This assessment is for educational purposes only and is not a substitute for professional medical advice.";
    }

    const result: DiagnosisResult = {
      ...diagnosis,
      sources
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Diagnosis API error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('TAVILY_API_KEY')) {
        return NextResponse.json(
          { error: 'Medical search service not configured' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('OPENAI_API_KEY')) {
        return NextResponse.json(
          { error: 'AI service not configured' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('429')) {
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again in a moment.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('Unable to locate sufficient evidence')) {
        return NextResponse.json({
          probable_conditions: ["Insufficient medical evidence available"],
          recommended_tests: ["Consult with healthcare provider for proper evaluation"],
          rx: [],
          safety_flags: "Unable to locate sufficient evidence. Please consult with a qualified healthcare provider for proper medical assessment.",
          sources: []
        });
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to process medical assessment. Please try again.' },
      { status: 500 }
    );
  }
}

// CORS headers for development
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}