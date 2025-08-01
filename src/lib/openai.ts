/**
 * OpenAI integration utilities
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create a medical diagnosis using OpenAI with function calling
 */
export async function createDiagnosis(
  patientData: any,
  medicalContext: string
): Promise<any> {
  const systemPrompt = `You are an expert medical AI assistant. Based on the patient data and medical context provided, generate a structured medical assessment.

IMPORTANT SAFETY GUIDELINES:
- If symptoms suggest emergency conditions (chest pain, difficulty breathing, severe allergic reactions, etc.), set safety_flags to "CALL EMERGENCY SERVICES IMMEDIATELY"
- Always emphasize this is educational only and not a substitute for professional medical advice
- Include relevant medical sources and evidence-based recommendations

Patient Data: ${JSON.stringify(patientData)}
Medical Context: ${medicalContext}

Provide a comprehensive assessment with probable conditions, recommended tests, and treatment suggestions.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Please analyze the patient data and provide a medical assessment.`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "create_prescription",
            description: "Create a structured medical prescription and diagnosis",
            parameters: {
              type: "object",
              properties: {
                probable_conditions: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of probable medical conditions"
                },
                recommended_tests: {
                  type: "array",
                  items: { type: "string" },
                  description: "Recommended diagnostic tests"
                },
                rx: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      drug: { type: "string" },
                      dosage: { type: "string" },
                      frequency: { type: "string" },
                      duration: { type: "string" },
                      notes: { type: "string" }
                    }
                  }
                },
                safety_flags: {
                  type: "string",
                  description: "Safety warnings or emergency flags"
                }
              },
              required: ["probable_conditions", "rx", "safety_flags"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "create_prescription" } },
      temperature: 0.3,
    });

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      return JSON.parse(toolCall.function.arguments);
    }
    
    throw new Error("No function call returned");
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to create diagnosis');
  }
}

/**
 * Retry logic for API calls with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (error && typeof error === 'object' && 'status' in error && error.status === 429) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError!;
}