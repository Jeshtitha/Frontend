
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getEcoInsights(distanceKm: number, passengers: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Calculate the environmental benefit of a ${distanceKm}km carpool trip in an Indian city with ${passengers} passengers instead of everyone driving separate cars. Mention the impact on local air quality (AQI) specifically for India. Provide a short, motivating summary in 2 sentences.`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "Every carpool helps clear the smog for a better tomorrow!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sharing rides reduces India's urban traffic and carbon footprint significantly.";
  }
}

export async function getRouteSuggestions(origin: string, destination: string) {
  try {
    // Using Geolocation for better Maps grounding
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide 3 smart carpooling tips for a route from ${origin} to ${destination} in India. Consider local traffic patterns (like monsoon delays or metro construction) and suggest specific popular landmarks as meeting points.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          }
        }
      },
    });

    // Extracting map URIs if provided by grounding
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const mapLinks = chunks.filter(c => c.maps).map(c => ({ 
      title: c.maps?.title || "View on Map", 
      uri: c.maps?.uri 
    }));

    // Returning a structured response with text and map links
    return {
      text: response.text,
      links: mapLinks
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return {
      text: "Avoid peak hours between 9 AM and 11 AM. Use major Metro stations as convenient pickup points.",
      links: []
    };
  }
}
