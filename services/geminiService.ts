import { GoogleGenAI, Type, Schema } from "@google/genai";
import { LessonContent } from "../types";

const apiKey = process.env.API_KEY;

// Schema for structured lesson output
const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the lesson" },
    theory: { type: Type.STRING, description: "The explanation in Italian. Clear, simple, suitable for a 13 year old. Use emojis. Keep it under 250 words." },
    vocabulary: {
      type: Type.ARRAY,
      description: "List of 5 key English words related to this topic.",
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING, description: "The English word." },
          translation: { type: Type.STRING, description: "Italian translation." },
          context: { type: Type.STRING, description: "A short English sentence using the word." }
        },
        required: ["word", "translation", "context"]
      }
    },
    examples: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "4 examples sentences in English with Italian translation in parentheses."
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "A quiz question to test understanding." },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 possible answers." },
          correctAnswerIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct answer." },
          explanation: { type: Type.STRING, description: "Brief explanation of why the answer is correct (in Italian)." }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"]
      }
    }
  },
  required: ["title", "theory", "vocabulary", "examples", "quiz"]
};

export const generateLesson = async (topicTitle: string): Promise<LessonContent> => {
  if (!apiKey) throw new Error("API Key missing");

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `You are an engaging English teacher for Italian middle school students (11-14 years old). 
  Create a lesson about "${topicTitle}".
  
  Guidelines:
  1. **Theory**: Explain the rule in Italian. Be funny, encouraging, and clear. Use analogies if possible.
  2. **Vocabulary**: Pick 5 important words used in this context.
  3. **Examples**: Provide clear English sentences with Italian translation.
  4. **Quiz**: 3 tricky but fair questions.

  Ensure the output is strictly valid JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.6,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as LessonContent;
  } catch (error) {
    console.error("Error generating lesson:", error);
    return {
      title: "Connection Error",
      theory: "Impossibile contattare il professore AI al momento. Controlla la tua connessione o riprova più tardi.",
      vocabulary: [],
      examples: [],
      quiz: []
    };
  }
};

export const getChatReply = async (history: {role: 'user' | 'model', text: string}[], message: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey });
  
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'LinguaBot', a friendly English tutor for an Italian teenager (13yo).
      
      BEHAVIOR:
      1. Speak mostly in English (Level A2/B1).
      2. If the user makes a grammar mistake, **correct it gently in Italian** inside parentheses, then reply in English. 
         Example: "I goed to school" -> "(Si dice 'I went to school' because 'go' is irregular!) Oh, you went to school? How was it?"
      3. Keep responses concise (max 2-3 sentences).
      4. Be encouraging and use emojis.
      5. Always end with a simple question to keep the chat alive.`
    },
    history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
    }))
  });

  const result = await chat.sendMessage({ message });
  return result.text || "Sorry, I didn't quite catch that.";
};