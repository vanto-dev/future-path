import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Shared Gemini client setup
  const getGeminiAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not defined.');
    }
    return new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // API Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // -------------------------------------------------------------
  // 1. AI Career Coach Chat Endpoint
  // -------------------------------------------------------------
  app.post('/api/ai/coach', async (req: Request, res: Response) => {
    try {
      const { message, history, profile, persona, activeTab } = req.body;
      const ai = getGeminiAI();

      const systemInstruction = `You are ${persona?.name || 'Maya Lin'}, a world-class ${persona?.title || 'Tech Recruiter & Career Strategist'}.
Your domain expertise: ${persona?.industry || 'Technology & Engineering'}.

The student's current profile:
- Name: ${profile?.fullName || 'Student'}
- University: ${profile?.universityId?.toUpperCase() || 'University'} (Major: ${profile?.major || 'CS'}, Standing: ${profile?.currentStanding || 'Junior'}, Grad: ${profile?.expectedGraduationDate || 'May 2027'})
- GPA: ${profile?.gpa || 'N/A'}
- Target Job Titles: ${profile?.targetJobTitles?.join(', ') || 'Software Engineer'}
- Target Industries: ${profile?.targetIndustries?.join(', ') || 'Tech'}
- Target Locations: ${profile?.preferredLocations?.join(', ') || 'SF Bay Area'}
- Work Auth: ${profile?.workAuthorization || 'US Citizen'}
- Current Skills: ${profile?.skills?.map((s: any) => s.name).join(', ') || 'Python, React'}
- Coursework: ${profile?.relevantCoursework?.join(', ') || 'Data Structures'}

Instructions:
1. Act strictly as an elite, supportive, yet sharp domain mentor. Give direct, actionable, practical advice tailored specifically to their major, graduation timeline, and target roles.
2. Avoid generic platitudes ("supercharge your growth", "empower your journey"). Give specific tactics, metrics, code concepts, or networking scripts.
3. If relevant, suggest a concrete 1-sentence action item that the student can add to their FuturePath action plan.
4. Keep responses clear, scannable, using bullet points or bold headings where appropriate.`;

      // Build conversation parts
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        history.slice(-8).forEach((msg: any) => {
          contents.push({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }]
          });
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contents as any,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const text = response.text || "I'm analyzing your request. How else can I help optimize your career strategy today?";
      res.json({ reply: text });
    } catch (error: any) {
      console.error('Error in /api/ai/coach:', error);
      res.status(500).json({
        error: 'Failed to generate AI Coach response',
        details: error.message || String(error)
      });
    }
  });

  // -------------------------------------------------------------
  // 2. Resume Audit & Parser Endpoint
  // -------------------------------------------------------------
  app.post('/api/ai/resume-audit', async (req: Request, res: Response) => {
    try {
      const { resumeText, targetRoles, targetIndustries, profile } = req.body;
      const ai = getGeminiAI();

      const userMajor = profile?.major || 'General Studies';
      const userDegree = profile?.degreeType || 'Bachelor\'s';
      const userTargetRoles = profile?.targetJobTitles?.length ? profile.targetJobTitles : (targetRoles?.length ? targetRoles : ['General Professional']);
      const userTargetIndustries = profile?.targetIndustries?.length ? profile.targetIndustries : (targetIndustries?.length ? targetIndustries : ['General Industry']);
      const userTargetFunctions = profile?.targetFunctions || [];
      const userCoursework = profile?.relevantCoursework || [];

      const prompt = `You are a Senior Talent Auditor and ATS Specialist.
Perform a deeply adaptive resume audit tailored specifically to the user's major, target industries, and target roles:

STUDENT CONTEXT:
- Major & Degree: ${userMajor} (${userDegree})
- Target Job Titles / Roles: ${userTargetRoles.join(', ')}
- Target Industries: ${userTargetIndustries.join(', ')}
${userTargetFunctions.length ? `- Target Functions: ${userTargetFunctions.join(', ')}` : ''}
${userCoursework.length ? `- Relevant Coursework: ${userCoursework.join(', ')}` : ''}

RESUME TEXT TO AUDIT:
"""
${resumeText}
"""

CRITICAL INSTRUCTIONS FOR ADAPTABILITY & DOMAIN SPECIFICITY:
1. ADAPT TO DOMAIN: Do NOT default to software engineering/tech terminology unless the user's major or target roles are tech-focused.
   - If targeting Finance/Quant/IB: Evaluate financial modeling, DCF, EBITDA, valuation, LBO, SEC filings, Excel/Bloomberg, analytical rigor.
   - If targeting Consulting/Strategy: Evaluate market sizing, client presentations, MECE frameworks, revenue/cost metrics, stakeholder management.
   - If targeting Healthcare/Pre-Med/Bio: Evaluate clinical trials, HIPAA, patient care, lab protocols, research publications, SPSS/R, IRB documentation.
   - If targeting Marketing/Product: Evaluate campaign performance, CAC, LTV, Conversion Rates, A/B testing, SEO/SEM, brand positioning.
   - If targeting Mechanical/Civil Engineering: Evaluate CAD (SolidWorks/AutoCAD), FEA, prototyping, MATLAB, project management, technical specs.
   - If targeting Tech/Software: Evaluate algorithms, systems, cloud, CI/CD, testing, APIs.
2. BEST FIT ROLES: Analyze what is CURRENTLY on the resume. Identify 3 to 4 specific job positions/titles that are the strongest current match for the candidate's existing experience, skills, and major.
3. TARGET ROLE ALIGNMENT: Grade how well this resume aligns specifically with their desired target positions (${userTargetRoles.join(', ')} in ${userTargetIndustries.join(', ')}). Provide a targetRoleMatchScore (0-100) and concise 2-3 sentence targetRoleAlignment feedback explaining strengths and specific gaps for those target roles.
4. QUANTIFIED BULLET REWRITES: Provide 3 bullet rewrites with domain-appropriate metrics (dollars, percentages, volume, efficiency, scale, patient outcomes, client ROI, etc.).
5. MISSING ATS KEYWORDS: Identify 6-8 missing high-value ATS keywords/tools specific to ${userTargetRoles.join(', ')} in ${userTargetIndustries.join(', ')}.

Return JSON matching schema:
{
  "overallScore": number (0-100),
  "atsCompatibilityScore": number (0-100),
  "impactScore": number (0-100),
  "targetRoleMatchScore": number (0-100),
  "bestFitRoles": string[] (array of 3-4 suggested roles based on resume content),
  "targetRoleAlignment": string (2-3 sentence analysis of alignment with targeted roles),
  "strengths": string[] (3-4 domain-specific bullet points),
  "keyImprovements": string[] (3-4 concrete fixes),
  "bulletRewrites": [
    { "original": string, "improved": string, "reason": string }
  ] (3 domain-relevant quantified rewrites),
  "missingKeywords": string[] (6-8 missing ATS keywords for target field)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.NUMBER },
              atsCompatibilityScore: { type: Type.NUMBER },
              impactScore: { type: Type.NUMBER },
              targetRoleMatchScore: { type: Type.NUMBER },
              bestFitRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
              targetRoleAlignment: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
              bulletRewrites: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    original: { type: Type.STRING },
                    improved: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['original', 'improved', 'reason']
                }
              },
              missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['overallScore', 'atsCompatibilityScore', 'impactScore', 'targetRoleMatchScore', 'bestFitRoles', 'targetRoleAlignment', 'strengths', 'keyImprovements', 'bulletRewrites', 'missingKeywords']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/ai/resume-audit:', error);
      res.status(500).json({ error: 'Failed to perform resume audit', details: error.message });
    }
  });

  // -------------------------------------------------------------
  // 3. Skill Gap Analysis Endpoint
  // -------------------------------------------------------------
  app.post('/api/ai/skill-gap', async (req: Request, res: Response) => {
    try {
      const { profile } = req.body;
      const ai = getGeminiAI();

      const prompt = `Perform a skill gap matrix analysis for student ${profile?.fullName || 'Alex'}.
Target Roles: ${profile?.targetJobTitles?.join(', ') || 'Software Engineer'}
Target Industry: ${profile?.targetIndustries?.join(', ') || 'Technology'}
Current Skills: ${profile?.skills?.map((s: any) => s.name).join(', ') || 'Python, React'}
Current Coursework: ${profile?.relevantCoursework?.join(', ') || 'Data Structures'}
Current Standing: ${profile?.currentStanding || 'Junior'}

Return a JSON object strictly matching this schema:
{
  "targetRole": string,
  "matchPercentage": number (0-100),
  "strongSkills": string[] (skills they possess that match well),
  "missingSkills": [
    { "name": string, "priority": "Critical" | "Recommended" | "Optional", "action": string }
  ] (4-6 key industry skills they lack),
  "recommendedProjects": [
    { "title": string, "description": string, "techStack": string[] }
  ] (2-3 portfolio project ideas that bridge these gaps),
  "recommendedCertifications": string[] (2-3 high-leverage certifications or recognized courses)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              targetRole: { type: Type.STRING },
              matchPercentage: { type: Type.NUMBER },
              strongSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    action: { type: Type.STRING }
                  },
                  required: ['name', 'priority', 'action']
                }
              },
              recommendedProjects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    techStack: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['title', 'description', 'techStack']
                }
              },
              recommendedCertifications: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['targetRole', 'matchPercentage', 'strongSkills', 'missingSkills', 'recommendedProjects', 'recommendedCertifications']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/ai/skill-gap:', error);
      res.status(500).json({ error: 'Failed to analyze skill gap', details: error.message });
    }
  });

  // -------------------------------------------------------------
  // 4. Draft Application Material Endpoint
  // -------------------------------------------------------------
  app.post('/api/ai/generate-custom-coach', async (req: Request, res: Response) => {
    try {
      const { userConcept, coachingStyle, profile } = req.body;
      const ai = getGeminiAI();

      const prompt = `Create a custom AI career coach persona tailored to the user's concept and background.

User Persona Concept / Mentor Role desired: "${userConcept || 'Senior AI Engineer & Career Mentor'}"
Coaching Style / Tone: "${coachingStyle || 'Direct, highly technical, tactical, and encouraging'}"

Student Profile Context:
- Major: ${profile?.major || 'Computer Science'} (${profile?.currentStanding || 'Junior'})
- Target Roles: ${profile?.targetJobTitles?.join(', ') || 'Software Engineering'}
- Target Industries: ${profile?.targetIndustries?.join(', ') || 'Tech'}
- Top Skills & Qualifications: ${profile?.skills?.map((s: any) => s.name).join(', ') || 'Python, Algorithms, Web Development'}
- Interests: ${profile?.targetFunctions?.join(', ') || 'Engineering, Systems, Product'}

Return a JSON object strictly matching this schema:
{
  "name": string (e.g. "Dr. Marcus Vance" or "Coach Sarah"),
  "title": string (e.g. "Principal AI Architect & High-Frequency Trading Recruiter"),
  "industry": string (e.g. "Generative AI & LLMs" or "Quantitative Finance"),
  "avatar": string (a high-quality professional portrait photo URL from unsplash, e.g. "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" or "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80" or "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80"),
  "systemPromptModifier": string (a 3-sentence detailed system instruction telling the AI how to behave, what tone to adopt, and how to analyze student resume/skills),
  "greeting": string (a personalized 2-sentence initial greeting to the student referencing their major and target roles)
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              title: { type: Type.STRING },
              industry: { type: Type.STRING },
              avatar: { type: Type.STRING },
              systemPromptModifier: { type: Type.STRING },
              greeting: { type: Type.STRING }
            },
            required: ['name', 'title', 'industry', 'avatar', 'systemPromptModifier', 'greeting']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/ai/generate-custom-coach:', error);
      res.status(500).json({ error: 'Failed to generate custom coach persona', details: error.message });
    }
  });

  app.post('/api/ai/draft-material', async (req: Request, res: Response) => {
    try {
      const { materialType, targetCompany, targetRole, recipientName, profile } = req.body;
      const ai = getGeminiAI();

      const prompt = `Draft a compelling, highly professional ${materialType} for a student applying to ${targetCompany || 'Target Company'} for the role of ${targetRole || 'Software Engineering Intern'}.

Student details:
- Name: ${profile?.fullName || 'Alex Chen'}
- University: ${profile?.universityId?.toUpperCase() || 'UC Berkeley'} (${profile?.major || 'Computer Science'}, Grad: ${profile?.expectedGraduationDate || 'May 2027'})
- Experiences: ${profile?.experiences?.map((e: any) => `${e.title} at ${e.organization}`).join('; ') || 'SWE Intern at TechNova'}
- Key Skills: ${profile?.skills?.map((s: any) => s.name).slice(0, 6).join(', ') || 'Python, TypeScript, React, SQL'}

Material requested:
${materialType === 'cold_outreach' ? 'A concise 120-word LinkedIn/Email message to an alumnus or recruiter requesting a 15-minute coffee chat.' : ''}
${materialType === 'cover_letter' ? 'A modern 3-paragraph tailored cover letter emphasizing project impact and enthusiasm.' : ''}
${materialType === 'linkedin_headline' ? '3 high-converting LinkedIn headline & About summary options.' : ''}
${materialType === 'thank_you' ? 'A warm post-interview thank you email referencing technical discussion points.' : ''}

Output plain text with clear formatting.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
      });

      res.json({ draft: response.text || '' });
    } catch (error: any) {
      console.error('Error in /api/ai/draft-material:', error);
      res.status(500).json({ error: 'Failed to draft material', details: error.message });
    }
  });

  // -------------------------------------------------------------
  // 5. Generate Timeline-Aware Action Plan
  // -------------------------------------------------------------
  app.post('/api/ai/action-plan', async (req: Request, res: Response) => {
    try {
      const { profile, milestones } = req.body;
      const ai = getGeminiAI();

      const prompt = `Create a prioritized 4-item career action plan for ${profile?.fullName || 'Alex'}, considering their upcoming academic calendar (midterms, final exams) and target graduation date (${profile?.expectedGraduationDate || 'May 2027'}).

Target Roles: ${profile?.targetJobTitles?.join(', ') || 'Software Engineer'}
Upcoming Deadlines/Exams: ${milestones?.map((m: any) => `${m.title} on ${m.date}`).join('; ') || 'Midterms in October'}

Return JSON array of items:
[
  {
    "id": string (unique e.g. "plan-1"),
    "title": string,
    "area": "resume" | "skills" | "networking" | "certification" | "project" | "application",
    "deadline": string (YYYY-MM-DD),
    "impact": "high" | "medium" | "low",
    "reasoning": string,
    "status": "pending",
    "steps": string[] (2-3 concrete sub-steps)
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                area: { type: Type.STRING },
                deadline: { type: Type.STRING },
                impact: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                status: { type: Type.STRING },
                steps: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['id', 'title', 'area', 'deadline', 'impact', 'reasoning', 'status', 'steps']
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/ai/action-plan:', error);
      res.status(500).json({ error: 'Failed to generate action plan', details: error.message });
    }
  });

  // -------------------------------------------------------------
  // 6. Calendar iCal (.ics) Export Endpoint
  // -------------------------------------------------------------
  app.post('/api/calendar/export-ics', (req: Request, res: Response) => {
    try {
      const { events } = req.body;
      if (!Array.isArray(events) || events.length === 0) {
        return res.status(400).json({ error: 'No events provided for export.' });
      }

      let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//FuturePath Student Platform//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\nX-WR-CALNAME:FuturePath Master Timeline\r\n`;

      events.forEach((evt: any) => {
        const cleanDate = evt.date || evt.startDate || '2026-09-01';
        const formattedDate = cleanDate.replace(/-/g, '');
        const summary = evt.title ? evt.title.replace(/,/g, '\\,') : 'Event';
        const description = (evt.description || evt.notes || '').replace(/\n/g, ' ').replace(/,/g, '\\,');

        icsContent += `BEGIN:VEVENT\r\n`;
        icsContent += `UID:${evt.id || Math.random().toString(36).substring(2)}@futurepath.app\r\n`;
        icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
        icsContent += `DTSTART;VALUE=DATE:${formattedDate}\r\n`;
        icsContent += `SUMMARY:[FuturePath] ${summary}\r\n`;
        icsContent += `DESCRIPTION:${description}\r\n`;
        icsContent += `STATUS:CONFIRMED\r\n`;
        icsContent += `END:VEVENT\r\n`;
      });

      icsContent += `END:VCALENDAR\r\n`;

      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="futurepath_calendar.ics"');
      res.send(icsContent);
    } catch (error: any) {
      console.error('Error in /api/calendar/export-ics:', error);
      res.status(500).json({ error: 'Failed to generate calendar file' });
    }
  });

  // -------------------------------------------------------------
  // 7. AI Mock Interview Generation & Evaluation Endpoints
  // -------------------------------------------------------------
  app.post('/api/ai/mock-interview/generate', async (req: Request, res: Response) => {
    try {
      const { company, role, interviewType, studentProfile } = req.body;
      const ai = getGeminiAI();

      const prompt = `You are a Principal Tech & Finance Interviewer for ${company || 'Top Tech Firm'}. Generate 3 realistic, high-signal interview questions for a candidate applying for the ${role || 'Software Engineer'} role.
Interview Category: ${interviewType || 'Behavioral'}.
Candidate Context: Major in ${studentProfile?.major || 'Computer Science'}, Year: ${studentProfile?.currentStanding || 'Junior'}.

Provide exactly 3 questions in structured JSON with fields:
- id: string
- questionText: string
- category: "${interviewType || 'Behavioral'}"
- idealAnswerOutline: string (bullet points on what top 10% candidates mention)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                questionText: { type: Type.STRING },
                category: { type: Type.STRING },
                idealAnswerOutline: { type: Type.STRING }
              },
              required: ['id', 'questionText', 'category', 'idealAnswerOutline']
            }
          }
        }
      });

      const parsed = JSON.parse(response.text || '[]');
      res.json({ questions: parsed });
    } catch (error: any) {
      console.error('Error in /api/ai/mock-interview/generate:', error);
      res.status(500).json({ error: 'Failed to generate mock interview questions', details: error.message });
    }
  });

  app.post('/api/ai/mock-interview/evaluate', async (req: Request, res: Response) => {
    try {
      const { company, role, questionText, userAnswer, category } = req.body;
      const ai = getGeminiAI();

      const prompt = `You are an elite interviewer for ${company} interviewing for ${role}.
Evaluate the user's answer to this interview question:
Question: "${questionText}"
User Answer: "${userAnswer}"
Category: ${category}

Evaluate rigorously (0-100 score). Provide:
1. aiScore (number 0-100)
2. strengths (string array of 2-3 key strengths)
3. improvements (string array of 2-3 specific ways to elevate the response)
4. starBreakdown: Object with situation, task, action, result feedback if applicable.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiScore: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
              starBreakdown: {
                type: Type.OBJECT,
                properties: {
                  situation: { type: Type.STRING },
                  task: { type: Type.STRING },
                  action: { type: Type.STRING },
                  result: { type: Type.STRING }
                }
              }
            },
            required: ['aiScore', 'strengths', 'improvements']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/ai/mock-interview/evaluate:', error);
      res.status(500).json({ error: 'Failed to evaluate interview answer', details: error.message });
    }
  });

  // -------------------------------------------------------------
  // 8. AI Portfolio / Project & Certification Rating Endpoint
  // -------------------------------------------------------------
  app.post('/api/ai/rate-portfolio', async (req: Request, res: Response) => {
    try {
      const { type, title, description, techStack, issuer, studentMajor } = req.body;
      const ai = getGeminiAI();

      const prompt = `You are a Technical Talent Auditor for top tech & finance recruiters.
Rate this ${type === 'project' ? 'Student Project' : 'Professional Certification'}:
Title: ${title}
${type === 'project' ? `Tech Stack: ${techStack?.join(', ')}\nDescription: ${description}` : `Issuer: ${issuer}`}
Student Major: ${studentMajor || 'Computer Science'}

Return JSON with:
- marketabilityScore: number (0 to 100)
- aiVerdict: string (One of: "${type === 'project' ? 'High Marketability" | "Strong Portfolio Asset" | "Needs Optimization" | "Basic' : 'Top Industry Standard" | "Valuable Credential" | "Emerging" | "Entry Level'}")
- aiFeedback: string (1-2 sentences of actionable recruiter feedback to maximize resume impact)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              marketabilityScore: { type: Type.NUMBER },
              aiVerdict: { type: Type.STRING },
              aiFeedback: { type: Type.STRING }
            },
            required: ['marketabilityScore', 'aiVerdict', 'aiFeedback']
          }
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json(parsed);
    } catch (error: any) {
      console.error('Error in /api/ai/rate-portfolio:', error);
      res.status(500).json({ error: 'Failed to rate portfolio item', details: error.message });
    }
  });

  // -------------------------------------------------------------
  // 9. Global & US Universities Search Endpoint (3,800+ US & Global Colleges)
  // -------------------------------------------------------------
  app.get('/api/universities/search', async (req: Request, res: Response) => {
    try {
      const query = String(req.query.q || '').trim();
      if (!query || query.length < 2) {
        return res.json({ universities: [] });
      }

      let results: Array<{ name: string; country?: string; domain?: string }> = [];

      // Try fetching from Hipo Universities API (over 9,800 global universities)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        
        const hipoRes = await fetch(
          `http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (hipoRes.ok) {
          const data = await hipoRes.json();
          if (Array.isArray(data) && data.length > 0) {
            results = data.map((u: any) => ({
              name: u.name,
              country: u.country,
              domain: u.domains?.[0] || ''
            }));
          }
        }
      } catch (err) {
        // Fallback to internal/Gemini lookup
      }

      // If Hipolabs API didn't return enough or failed, call Gemini if query is detailed
      if (results.length === 0 && query.length >= 3) {
        try {
          const ai = getGeminiAI();
          const prompt = `Return a JSON array of up to 10 real accredited higher-education institutions (universities, colleges, community colleges worldwide) matching the search query: "${query}".
Return format MUST be a JSON object with a "universities" string array of official full institution names.`;

          const aiRes = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  universities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['universities']
              }
            }
          });
          const parsed = JSON.parse(aiRes.text || '{}');
          if (Array.isArray(parsed.universities)) {
            results = parsed.universities.map((u: string) => ({ name: u }));
          }
        } catch (e) {
          // Ignore AI failure
        }
      }

      // Filter unique by name
      const uniqueMap = new Map<string, { name: string; country?: string; domain?: string }>();
      results.forEach(r => {
        if (!uniqueMap.has(r.name.toLowerCase())) {
          uniqueMap.set(r.name.toLowerCase(), r);
        }
      });

      res.json({ universities: Array.from(uniqueMap.values()) });
    } catch (error: any) {
      console.error('Error in /api/universities/search:', error);
      res.status(500).json({ error: 'Failed to search universities', details: error.message });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FuturePath server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
