
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Meme, Winner } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const judgeMemes = async (memes: Meme[]): Promise<Winner[]> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    // Return mock data if API key is not available
    return [
        { groupName: "Mock Winner 1", justification: "This is a mock justification because the API key is missing."},
        { groupName: "Mock Winner 2", justification: "This is another mock justification. Please set your API key."}
    ];
  }
  
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  const memeParts = await Promise.all(
    memes.map(async (meme) => {
      const imagePart = await fileToGenerativePart(meme.file);
      return {
        groupName: meme.file.name.split('_meme.')[0],
        imagePart: imagePart,
      };
    })
  );

  const promptParts = [
    `You are an expert meme judge for the 'AI Meme Madness' competition.
    Your task is to evaluate the following memes based on three criteria:
    1. Humor: How funny is the meme?
    2. Creativity: How original and clever is the concept?
    3. Relevance to AI: How well does it connect to the theme of AI transforming daily work or life?
    
    You must analyze all the memes provided and select the top 2 winning groups.
    Provide your response strictly in the requested JSON format. For each winner, provide a brief justification for your choice.
    
    Here are the memes to judge:`,
  ];

  memeParts.forEach((part) => {
    promptParts.push(`Group: ${part.groupName}`);
    promptParts.push(part.imagePart.inlineData.data);
  });
  
  const contents = memeParts.flatMap(part => [
      { text: `Meme from group: ${part.groupName}` },
      part.imagePart
  ]);

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
            {
                parts: [
                    {
                        text: `You are an expert meme judge for the 'AI Meme Madness' competition. Your task is to evaluate a collection of memes based on three criteria: 1. Humor, 2. Creativity, 3. Relevance to AI adoption in professional or personal life. Analyze all the provided memes and select the top 2 winning groups. For each winner, provide a brief justification for your choice. The memes are provided as a series of images, each associated with a group name.`
                    },
                    ...contents
                ]
            }
        ],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    winners: {
                        type: Type.ARRAY,
                        description: "The top 2 winning groups.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                groupName: {
                                    type: Type.STRING,
                                    description: "The name of the winning group."
                                },
                                justification: {
                                    type: Type.STRING,
                                    description: "A brief explanation for why this group won."
                                }
                            },
                            required: ["groupName", "justification"]
                        }
                    }
                },
                required: ["winners"]
            }
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && result.winners && Array.isArray(result.winners)) {
        return result.winners.slice(0, 2);
    }
    
    throw new Error("Invalid response format from AI.");

  } catch (error) {
    console.error("Error judging memes with AI:", error);
    throw new Error("Failed to get a valid judgment from the AI. Please try again.");
  }
};
