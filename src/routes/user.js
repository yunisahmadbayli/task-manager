const express = require('express')
const router = new express.Router()
const auth = require('../middlewares/auth')
const User = require('../models/user')
const multer = require('multer')
const sharp = require('sharp')
const { sendEmail,cancelEmail } = require('../emails/account.js')

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {

        await user.save()
        sendEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})

    } catch (error) {
        console.log(error)
    }

})

router.get('/users/me',auth, async (req, res) => {
    
    res.send(req.user)
    
    // try {

    //     const users = await User.find({})
    //     res.status(201).send(users)

    // } catch (error) {
    //     console.log(error)
    // }
})


router.patch('/users/me',auth,  async (req, res) => {

    const uptades = Object.keys(req.body)
    const allowedUpt = ['name', 'email', 'password', 'age']
    const isValid = uptades.every((uptade) => allowedUpt.includes(uptade))


    if (!isValid) {
        return res.status(404).send({ error: 'Invalid uptades' })
    }

    try {

        
        uptades.forEach((uptade)=> req.user[uptade]  = req.body[uptade])
        await req.user.save()

        res.send(req.user)

    } catch (error) {
        res.status(404).send(error)
    }
})

router.delete('/users/me',auth, async (req, res) => {

    try {
        await req.user.remove()
        cancelEmail(req.user.email,req.user.name)
        res.send('Removed')

    } catch (error) {
        return error
    }

})

router.post('/users/login',async (req,res)=>{
   try {
       const user = await User.findByCredentials(req.body.email, req.body.password)
       const token = await user.generateAuthToken()
       res.send({user,token})
   } catch (error) {
       res.status(400).send(error)
   }
})

router.post('/users/logout',auth, async(req,res)=>{
    try {
        
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.uses.save()

        res.send()

    } catch (error) {
        res.status(501).send()
        
    }
})

router.post('/users/logoutall',auth,async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(501)
    }
})

const upload = multer({
    
    limits : {
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload only jpeg,jpg or png files'))
        }
    }
},(error,res,req,next)=>{
    res.status(404).send({error:error.message})
})



router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width : 250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send('OK')
},(error,req,res,next)=>{
    res.status(404).send(error)
})


router.delete('/users/me/avatar',auth, async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)   
        if(!user||!user.avatar){
            throw new Error()
        }

        res.sent('Content-Type','image/png')
        res.send(user.avatar)

    } catch (error) {

        res.status(404).send(error)
        
    }
})

module.exports = router