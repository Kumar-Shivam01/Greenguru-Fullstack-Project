const express = require('express')
const plantRouter = express.Router();
const plantController = require('./../controllers/plantController')
const protectedRoute = require('../middlewares/protectedRoute')
const upload = require('../middlewares/upload')

plantRouter.route('/identify').post(protectedRoute,upload.single("image"),plantController.identifyPlant)   
plantRouter.route('/').post(protectedRoute,plantController.createPlant)
plantRouter.route('/').get(protectedRoute,plantController.getMyPlants)
plantRouter.route('/:id').get(protectedRoute,plantController.getPlantById)
plantRouter.route('/:id').patch(protectedRoute,plantController.updatePlant)
plantRouter.route('/:id/water').patch(protectedRoute,plantController.waterPlant)
plantRouter.route('/:id').delete(protectedRoute,plantController.deletePlant)
plantRouter.route('/:id/checkin').post(protectedRoute,upload.single("image"),plantController.addHealthCheckin)
module.exports = plantRouter 