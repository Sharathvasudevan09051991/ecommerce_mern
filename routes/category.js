const express = require('express');
const router = express.Router();

const {create} = require("../controllers/category");

router.post('/catgeory/create', create);

module.exports = router;