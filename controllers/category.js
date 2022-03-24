const Category = require("../models/category");

exports.create = async (req, res) => {
    try {
        const {name} = req.body;

        const oldCategory = await Category.findOne({name});

        if(oldCategory){
            return res.status(400).json({msg: "Category Already Exists"})
        }

        const category = new Category({name});

        await category.save((err, data)=> {
            if(err){
                console.log(err);
                return res.status(400).json({msg: "Oops some issue occurs"})
            }
            res.json({data});
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).send('Server Error')
    }
}