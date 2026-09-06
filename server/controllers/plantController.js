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

//It receives the already-generated imageUrl and AI data from the frontend and persists the final plant.
exports.createPlant = asyncErrorHandler(async (req,res,next)=>{
    const userId = req.userId;
    //get user from protected route
    if(!userId){
        return next(new CustomError("User not authenticated",401))
    }
    //get required fields from req.body
    const {
        nickname,
        imageUrl,

        // AI identification
            commonName,
            scientificName,
            species,
            family,
            aiConfidence,
            identificationStatus,

            // Care information
            careInfo,

            // Health information
            healthStatus,
            aiObservation,
            actionableFix,

            // User-provided fields
            location,
            lastWatered, 
    } = req.body
    // validate required fields
    if(!nickname || !nickname.trim()){
        return next(new CustomError('Please give your plant a nickname',400))
    }
    const healthTimeline = [];
    if(healthStatus){
        healthTimeline.push({
            imageUrl,
            healthStatus,
            aiObservation: aiObservation || "",
            actionableFix: actionableFix || "",
            recordedAt: new Date(),
        })
    }
     // Construct plant document
    const plant = {
        user: userId,

        //user-provided
        nickname: nickname.trim(),
        imageUrl,
        location,
        lastWatered: lastWatered || null,

        //AI identification
        commonName: commonName || null,
        scientificName: scientificName || null,
        species: species || null,
        family: family || null,
        aiConfidence: aiConfidence !== undefined ? aiConfidence : null, 
        identificationStatus: identificationStatus || "pending",

        //AI Care Info
        careInfo:{
            waterFrequency: careInfo?.waterFrequency || null,
            waterIntervalDays: careInfo?.waterIntervalDays ?? 7,
            sunlight: careInfo?.sunlight || null,
            soilType: careInfo?.soilType || null,
            temperature: careInfo?.temperature || null,
            humidity: careInfo?.humidity || null,
            toxicity: careInfo?.toxicity || null,
            difficulty: careInfo?.difficulty || null,
        },
        //AI health information
        healthStatus: healthStatus || "healthy",
        aiObservation: aiObservation || "",
        actionableFix: actionableFix || "",

        //Initial health record
        healthTimeline
    }
    //save plant to mongoDB
    const createdPlant = await Plant.create(plant)

    //return created plant
    return res.status(201).json({
        success: true,
        data: {
            createdPlant
        },
    })
})

exports.getMyPlants = asyncErrorHandler(async (req,res,next)=>{
        // Get authenticated user's ID
       const userId = req.userId;
       if(!userId) return next(new CustomError('User not authenticated',401))
       
        //Get query params
        const {
            location,
            healthStatus,
            search,
            sort = "newest"
        } = req.query

           // 3. Allowed enum values
        const allowedLocations = [
            "Indoors",
            "Outdoors",
            "Living room",
            "Balcony",
            "Garden",
            "Other",
        ];

        const allowedHealthStatuses = [
            "healthy",
            "needs-attention",
            "sick",
            "dormant",
        ];

        const allowedSorts = [
            "newest",
            "lastWatered",
        ];
        //add location filter
        if(location && !allowedLocations.includes(location)){ 
            return next(new CustomError(`Invalid location. Allowed values: ${allowedLocations.join(", ")}`,400))
        }

        //add health status filter 
        if(healthStatus && !allowedHealthStatuses.includes(healthStatus)){
            return next(new CustomError(`Invalid health status. Allowed values: ${allowedHealthStatuses.join(", ")}`,400))
        }

        // Validate sort parameter 
        if (!allowedSorts.includes(sort)) {
            return next(new CustomError(`Invalid sort value. Allowed values: ${allowedSorts.join(", ")}`,400))
        }
        
        const filter = {user: userId}

        //add location filter
        if(location) filter.location = location

        //add health status filter
        if(healthStatus) filter.healthStatus = healthStatus

        //Search nickname or commonName
        if(search && search.trim()){
            filter.$or = [ //Match by nickname or commonName
                {
                    nickname: { $regex: search.trim(), $options: "i"} //"i" makes search case-insensitive
                },
                {
                    commonName: { $regex: search.trim(), $options: "i"}
                },
                
            ]
        }
        // decide sorting
        let sortOption;
        if(sort === "lastWatered")
            sortOption = {lastWatered: -1} //1 for ascending
        else
            //default new plants first
            sortOption = {createdAt: -1};

        const plants = await Plant.find(filter).sort(sortOption)
        //return response
        return res.status(200).json({
            success: true,
            count: plants.length,
            data: {
                plants,
            },
        })
})  
