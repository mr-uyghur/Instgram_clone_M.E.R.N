const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")


router.get('/allpost', requireLogin,(req,res) =>{
    // this code will find all the post.
    Post.find()
    .populate("postedBy", "_id name")
    .then(posts => {
        res.json({posts:posts})
    })
    .catch(err =>{
        console.log(err)
    })
})

router.post('/createpost',requireLogin, (req, res) => {
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        res.status(422).json({error:"please complete your post"})
    }
    // with the code below, user password won't be posted to our data
    req.user.password = undefined
    const post = new Post({
        title: title,
        body: body, 
        photos: pic,
        postedBy: req.user,

    })

    post.save().then(result => {
        res.json({post:result})
    })
    .catch(err =>{
        console.log(err)
    })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost:mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

// create routes for like and unlike
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        // remove the user from likes array
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})


module.exports = router