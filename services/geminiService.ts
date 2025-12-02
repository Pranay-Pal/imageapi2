import { GoogleGenAI } from "@google/genai";
import { fileToBase64 } from "../utils/fileUtils";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Calls Gemini to cartoonify an image.
 * Uses 'gemini-2.5-flash-image' (Nano Banana).
 */
export const cartoonifyImage = async (
  imageFile: File,
  stylePrompt: string
): Promise<string> => {
  try {
    const base64Data = await fileToBase64(imageFile);

    // Using gemini-2.5-flash-image (Nano Banana) for image editing/generation tasks
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Data,
            },
          },
          {
            text: `Transform this image into a ${stylePrompt} cartoon. Maintain the composition but change the style completely. Return ONLY the image.`,
          },
        ],
      },
      // Note: responseMimeType is not supported for nano banana models
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data returned from Gemini.");
  } catch (error) {
    console.error("Error cartoonifying image:", error);
    throw error;
  }
};
