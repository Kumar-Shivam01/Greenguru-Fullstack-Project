const CustomError = require('./../utils/CustomError')
const cloudinaryService = require('./../services/cloudinaryService')
const geminiService = require('./../services/geminiService')
const asyncErrorHandler = require('./../utils/asyncErrorHandler')

exports.identifyPlant = asyncErrorHandler(async (req, res, next) => {
    if (!req.file) return next(new CustomError("Please upload your plant image", 400))

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    //1. Upload to cloud
    const cloudinaryResult = await cloudinaryService.uploadImage(fileBuffer);
    const imageUrl = cloudinaryResult.secure_url;

    //2. pass buffer to Gemini for analysis
    const aiResult = await geminiService.analysePlantImage(fileBuffer, mimeType);

    //3. Return the preview data
    return res.status(200).json({
        success: true,
        data: {
            imageUrl,

            // Identification
            commonName: aiResult.commonName,
            scientificName: aiResult.scientificName,
            species: aiResult.species,
            family: aiResult.family,
            aiConfidence: aiResult.aiConfidence,
            identificationStatus: aiResult.identificationStatus,

            // Care information
            careInfo: {
                waterFrequency: aiResult.careInfo?.waterFrequency ?? null,
                waterIntervalDays:
                    aiResult.careInfo?.waterIntervalDays ?? 7,
                sunlight: aiResult.careInfo?.sunlight ?? null,
                soilType: aiResult.careInfo?.soilType ?? null,
                temperature: aiResult.careInfo?.temperature ?? null,
                humidity: aiResult.careInfo?.humidity ?? null,
                toxicity: aiResult.careInfo?.toxicity ?? null,
                difficulty: aiResult.careInfo?.difficulty ?? null,
            },

            // Health information
            healthStatus: aiResult.healthStatus,
            aiObservation: aiResult.aiObservation,
            actionableFix: aiResult.actionableFix,
        },
    })
})

module.exports = identifyPlant