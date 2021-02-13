const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")


router.get('/allpost',(req,res) =>{
    // this code will find all the post.
    Post.find()
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
    .then(posts => {
        res.json({posts:posts})
    })
    .catch(err =>{
        console.log(err)
    })
})
router.get('/getsubpost', requireLogin,(req,res) =>{
    // this code will find all the post the logged in user is following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy", "_id name pic")
    .populate("comments.postedBy", "_id name pic")
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
    })
    // poputlate these datas from users before exec code, to avoid glitches 
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
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
    })
       // poputlate these datas from users before exec code, to avoid glitches 
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        // push comment into the model
        $push:{comments:comment}
    },{
        new:true
    })
       // poputlate these datas from users before exec code, to avoid glitches 
    .populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate('postedBy',"_id name pic")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err =>{
                console.log(err)    
            })
        }
    })
})

router.delete('/deletecomment/:postId/:commentId', requireLogin, async (req, res) => {
    try {
        let post = await Post.findOne({ _id: req.params.postId })
           // poputlate these datas from users before exec code, to avoid glitches 
            .populate("comments.postedBy", "_id name pic")
            .populate("postedBy", "_id name pic")
        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }
        post.comments = await post.comments.filter(comment => {
            return comment._id != req.params.commentId
        })
 
        const result = await post.save()
        return res.json(result)
 
    } catch (err) {
        console.error("Error", err);
    }
})


module.exports = router