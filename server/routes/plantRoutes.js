const express = require('express')
const plantRouter = express.Router();
const plantController = require('./../controllers/plantController')
const upload = require('../middlewares/upload')

plantRouter.route('/identify').post(upload.single("image"),plantController)   

module.exports = plantRouter