const { json } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')

// router.get('/protected',requireLogin, (req,res)=>{
//     console.log('Hello User')
// })

router.post('/signup', (req, res) => {
    console.log(req.body.name)
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "please fill out the information" })
    }

    User.findOne({ email: email })
        .then(savedUser => {
            if (savedUser) {
                return res.status(422).json({
                    error: "User with this email already exists"
                })
            }
            //    use bcrypt to hash password
            bcrypt.hash(password, 12)
                // adter hashing the password 
                .then(hashedpassword => {
                    const user = new User({
                        email: email,
                        password: hashedpassword,
                        name: name,
                    })

                    user.save()
                        .then(user => {
                            res.json({
                                message: "saved successfully"
                            })
                                .catch(err => {
                                    console.log(err)
                                })
                        })
                })
                .catch(err => {
                    console.log(err)
                })
        })

})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({
            error: "please provide your email or password"
        })
    }
    User.findOne({
        email: email
    })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "email or password is invalid" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({message:"successfully signed in"})
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const {_id,name,email,followers,following} = savedUser
                        res.json({ token: token,user:{_id,name,email,followers,following} })
                    }
                    else {
                        return res.status(422).json({ error: "email or password is invalid" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

module.exports = router