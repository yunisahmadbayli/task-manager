require('./db/mongoose')
const multer = require('multer')
const express = require('express')
const userRoute = require('./routes/user')
const taskRoute = require('./routes/tasks')
const app = express()
const port = process.env.PORT


app.use(express.json())
app.use(taskRoute)
app.use(userRoute)



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const upload = multer({
//     dest : 'images',
//     limits : {
//         fileSize : 1000000,
//     },
//     fileFilter(req,file,cb){
//         // if(!file.originalname.endsWith('.pdf')){
//         //     return cb(new Error('Please upload pdf file'))
//         // }

//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('Please upload DOC or DOCx files'))
//         }
//         cb(undefined,true)
//     }
// })

// app.post('/upload',upload.single('upload'),(req,res)=>{
//     res.send()
// },(error,req,res,next)=>{
//     res.status(404).send({error : error.message})
// })





// const pass = async ()=>{
//     const password = 'yunis123'
//     const hashedpass = await crypt.hash(password,8)
//     console.log(password)
//     console.log(hashedpass)

//     const isEqual = await crypt.compare(password,hashedpass)
//     console.log(isEqual)

// }

// pass()
const User = require('../src/models/user')




// const main = async ()=>{

//     const user = await User.findById('61ed4bc4d72a0023188ff764')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()



