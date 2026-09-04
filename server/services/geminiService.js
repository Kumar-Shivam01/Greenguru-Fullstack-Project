const { GoogleGenAI } = require("@google/genai")
const asyncErrorHandler = require("../utils/asyncErrorHandler")
require('dotenv').config()

const ai = new GoogleGenAI({ //creates gemini client
    apiKey: process.env.GEMINI_API_KEY
})

const analysePlantImage = asyncErrorHandler(async (fileBuffer, mimeType) => {
    const prompt = `
You are an expert botanist and plant-care specialist.

Analyze the plant shown in the provided image.

Your task is to identify the plant, provide practical care information,
and assess its visible health condition.

Return ONLY valid JSON matching the exact structure below.
Do not add any additional fields.

{
  "commonName": "string or null",
  "scientificName": "string or null",
  "species": "string or null",
  "family": "string or null",
  "aiConfidence": 0,
  "identificationStatus": "identified",

  "careInfo": {
    "waterFrequency": "string or null",
    "waterIntervalDays": 7,
    "sunlight": "string or null",
    "soilType": "string or null",
    "temperature": "string or null",
    "humidity": "string or null",
    "toxicity": "string or null",
    "difficulty": "easy"
  },

  "healthStatus": "healthy",
  "aiObservation": "string",
  "actionableFix": "string"
}

IDENTIFICATION RULES:

- commonName: The commonly used name of the plant.
- scientificName: The full scientific/botanical name.
- species: The species name or abbreviated species, such as "E. aureum".
- family: The botanical family, such as "Araceae".
- aiConfidence: A number between 0 and 1 representing your confidence
  in the plant identification.

IDENTIFICATION STATUS:

- Use "identified" when the plant can be identified with reasonable confidence.
- Use "failed" when the image does not contain a plant or the plant
  cannot reasonably be identified.
- Do not use "pending" because the analysis is being performed now.
- Do not use "manual" because this is an AI identification.

CARE RULES:

- waterFrequency: Give a human-readable watering recommendation,
  such as "Every 7-10 days".
- waterIntervalDays: Give a representative number of days that can be
  used by the application for watering countdown calculations.
- sunlight: Describe the appropriate light conditions.
- soilType: Describe the recommended soil type.
- temperature: Give the preferred temperature range.
- humidity: Give the preferred humidity level.
- toxicity: State whether the plant is toxic to pets or humans when
  reliable information is available.
- difficulty: Must be exactly one of:
  "easy", "moderate", or "hard".

HEALTH RULES:

Assess only what is visibly observable in the image.

healthStatus MUST be exactly one of:
- "healthy"
- "needs-attention"
- "sick"
- "dormant"

aiObservation:
- Describe visible health characteristics or symptoms.
- If the plant appears healthy, explain briefly why.
- Do not invent symptoms that are not visible.

actionableFix:
- Give a practical action based on the visible condition.
- If the plant appears healthy, give a simple maintenance recommendation.

IMPORTANT:

- Do not invent information when the image does not provide enough
  evidence.
- If identification is uncertain, use null for uncertain identification
  fields and lower the aiConfidence.
- aiConfidence must always be between 0 and 1.
- waterIntervalDays must be a positive number.
- Return ONLY the JSON object.
`;
    const imageBase64 = fileBuffer.toString('base64');
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
            {
                role: "User",
                parts: [
                    {
                        text: prompt,
                    },
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: imageBase64
                        }
                    }
                ]
            }
        ]
    })
    const text = response.text.trim();
    const cleanedText = text
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

    return JSON.parse(cleanedText)
})

module.exports = { analysePlantImage }

