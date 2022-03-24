const formidable = require("formidable");
const Product = require("../models/product");
const fs = require('fs'); 

exports.create = (req, res) => {

    //Basic Setup
    let form = new formidable.IncomingForm()
 
    //Basic Configuration
    // form.multiples = true
    // form.maxFileSize = 50*1024*1024  //5MB
    form.keepExtensions = true

    try {
    //Parsing
    form.parse(req, (err, fields, files) => {

        if(err){
            return res.status(400).json({
                msg: 'Parse Error'
            })
        }
        let product = new Product(fields)
        
        if(files.photo){

            if(files.photo.size > 100000){
                return res.status(400).json({msg: "Image size doesn't not exceed 1MB"})
            }

            product.photo.data = fs.readFileSync(files.photo.filepath)
            product.photo.contentType = files.photo.type
        }

        product.save((err, result) => {
         if(err){
           return res.status(400).json({
               msg: "The Image is not saved successfully"
           })
         }
           res.json(result)
        })
   })       
    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error')
    }
}

exports.productById = async (req, res) => {

    //console.log(req.params.id);
    try {
        const product = await Product.findById(req.params.id);

        if(!product){
            return res.status(404).json({msg: "Product not found"})
        }

        res.json(product);

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error')
    }
}