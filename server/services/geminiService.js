const { GoogleGenAI } = require("@google/genai")
require('dotenv').config()

const ai = new GoogleGenAI({ //creates gemini client
    apiKey: process.env.GEMINI_API_KEY
})

const analysePlantImage = async (fileBuffer, mimeType) => {
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
        model: 'gemini-3.5-flash',
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
}

const analyzePlantHealth = async (
    fileBuffer,
    mimeType,
    scientificName
) => {
    const prompt = `
You are an expert plant health diagnostic assistant.

Analyze the uploaded plant image and determine the plant's CURRENT HEALTH CONDITION.

The plant was previously identified as:
${scientificName || "Unknown"}

Use the previous scientific name only as contextual information.
Do NOT blindly assume that the previous identification is correct.
Inspect the uploaded image yourself.

Your task is ONLY to assess the plant's current health.

Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.
Do not include explanations outside the JSON.

The JSON must have EXACTLY these fields:

{
  "healthStatus": "healthy | needs-attention | sick | dormant",
  "aiObservation": "string",
  "actionableFix": "string"
}

Rules:

1. healthStatus:
   - "healthy" = plant appears healthy with no significant visible problems.
   - "needs-attention" = mild or moderate visible issues that should be addressed.
   - "sick" = significant signs of disease, severe stress, pest damage, or serious health problems.
   - "dormant" = plant appears to be in a normal dormant/resting state.

2. aiObservation:
   - Describe what you can actually observe in the image.
   - Mention visible symptoms such as yellowing, browning, wilting, spots,
     pest damage, leaf drop, discoloration, poor growth, or healthy new growth.
   - Do not invent symptoms that are not visible.
   - Keep the observation concise and useful to the user.

3. actionableFix:
   - Give practical immediate care advice based on the visible symptoms.
   - If the plant appears healthy, recommend continuing the current care routine.
   - Do not give overly specific treatment instructions when the image does not
     provide enough evidence to determine the exact cause.

4. If the image does not clearly contain a plant or the image quality is too poor
   to assess its health reliably:
   - Set "healthStatus" to "needs-attention".
   - Explain the limitation in "aiObservation".
   - Give a reasonable action in "actionableFix", such as asking the user to
     provide a clearer photo.

5. Do not return:
   - commonName
   - scientificName
   - species
   - family
   - careInfo
   - aiConfidence
   - identificationStatus
   - nickname
   - imageUrl
   - location
   - lastWatered
   - healthTimeline

Return ONLY the three requested health-analysis fields.
`;

    const imageBase64 = fileBuffer.toString("base64");
    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
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
                            data: imageBase64,
                        },
                    },
                ],
            },
        ],
    });

    const text = response.text.trim();
    const cleanedText = text
        .replace(/^```json/, "")
        .replace(/^```/, "")
        .replace(/```$/, "")
        .trim();

    return JSON.parse(cleanedText);
};

module.exports = { analysePlantImage,analyzePlantHealth }

