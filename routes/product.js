const express = require('express');
const router = express.Router();

const {create, productById} = require("../controllers/product");

router.post('/product/create', create);
router.get('/product/:id', productById);

module.exports = router;