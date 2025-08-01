# MedCanvas - AI-Powered Medical Assessment Platform

A sophisticated web application that provides AI-powered medical assessments using real-time research data from Tavily Search and clinical reasoning from OpenAI GPT-4.

## ⚠️ Important Disclaimer

This platform is for **educational purposes only** and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

## Features

- 🩺 **Interactive Questionnaire** - Multi-step medical assessment form
- 🤖 **AI-Powered Analysis** - GPT-4 clinical reasoning with function calling
- 🔍 **Real-Time Medical Research** - Tavily Search integration for up-to-date guidelines
- 📊 **Visual Results** - Charts and tables for diagnosis presentation
- 📋 **Editable Prescriptions** - Draft prescriptions with PDF export
- 🔒 **Privacy First** - No PHI stored server-side, all data local
- ⚡ **Emergency Detection** - Automatic safety flags for urgent symptoms
- 🎨 **Glass-Morphism UI** - Modern, artistic interface design

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, daisyUI
- **Animations**: Framer Motion
- **AI**: OpenAI GPT-4, Tavily Search API
- **Charts**: Recharts
- **PDF Export**: jsPDF
- **Icons**: Lucide React

## Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```
OPENAI_API_KEY=your-openai-key-here
TAVILY_API_KEY=your-tavily-key-here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open** [http://localhost:3000](http://localhost:3000)

## API Testing

Test the diagnosis endpoint:

```bash
curl -X POST http://localhost:3000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{
    "age": 30,
    "sex": "male",
    "chiefComplaint": "headache and fever",
    "symptoms": ["headache", "fever", "fatigue"],
    "duration": "2-3-days",
    "severity": 3,
    "medications": [],
    "allergies": []
  }'
```

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel --prod
```

**🤖 Generated with [Claude Code](https://claude.ai/code)**

// END OF PROJECT
