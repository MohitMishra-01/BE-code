const express = require("express");
const ExpressFormidable = require("express-formidable");
const multer = require("multer");
const { imageUploadController } = require("../controllers/ImageUpload");
router = express.Router();

router.post(
    "/uploadImage",
    ExpressFormidable({ maxFieldsSize: 5*2024*2024}),
    imageUploadController
)

module.exports = router;