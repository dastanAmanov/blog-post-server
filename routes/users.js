const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcrypt')

//UPDATE    
router.put('/:id', async (req, res) => {
    if(req.body.userId === req.params.id){
        if(req.body.password) {
            const solt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, solt);
        }
        try{
            const updateUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            },
            {new: true}
            );
            res.status(200).json(updateUser)
        }catch(err) {
           res.status(500).json(err); 
        }
    }
    else{
        res.status(401).json('faqat hisobingizni yangilashingiz mumkin')
    }
})

//DELETE
router.delete('/:id', async (req, res) => {
    if(req.body.userId === req.params.id){
        try{
            const user = await User.findById(req.params.id);
            try{
                await Post.deleteMany({username: user.username})
                 await User.findByIdAndDelete(req.params.id);
                res.status(200).json("user o\'chirildi")
            }catch(err) {
               res.status(500).json(err); 
            }
        }catch(err){
            res.status(404).json('user topilmadi!')
        }
    }
    else{
        res.status(401).json('faqat hisobingizni o\'chirishigiz mumkin')
    }
})

//GET 
router.get("/:id", async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others)
    }catch(err) {
        res.status(500).json(err)
    }
})
router.get("/", async (req, res) => {
    try{
        const user = await User.find({});
        res.status(200).json(user)
    }catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router