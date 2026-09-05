const path = require('path');
const Plant = require('../models/plantModel')
const CustomError = require('./../utils/CustomError')
const cloudinaryService = require('./../services/cloudinaryService')
const geminiService = require('./../services/geminiService')
const asyncErrorHandler = require('./../utils/asyncErrorHandler')

//identification of plant via Gemini API with cloudinary storage
exports.identifyPlant = asyncErrorHandler(async (req, res, next) => {
    if (!req.file) return next(new CustomError("Please upload your plant image", 400))

    const fileBuffer = req.file.buffer;
    let mimeType = req.file.mimetype;

    // Fallback if client/Postman sends generic octet-stream
    //This happens because the front end is sending the request as multipart/form-data, and Multer extracts the image buffer
    if (!mimeType || !mimeType.startsWith('image/')) {
        const ext = path.extname(req.file.originalname).toLowerCase();
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        else if (ext === '.webp') mimeType = 'image/webp';
        else mimeType = 'image/jpeg';
    }
    
    //1. Upload to cloud
    const cloudinaryResult = await cloudinaryService.uploadImage(fileBuffer); //filebuffer contains the binary data of the image
    const imageUrl = cloudinaryResult.secure_url; //url returned by cloudinary to display the image in frontend

    //2. pass buffer to Gemini for analysis
    const aiResult = await geminiService.analysePlantImage(fileBuffer, mimeType); //mimeType tells Gemini what type of data the buffer contains (e.g., image/jpeg, image/png) so it can decode and interpret the image correctly

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