const mongoose = require('mongoose')
const validator = require('validator')
const crypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const  Task = require('./task')

const userShcema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }

    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot equal "password" ')
            }
        }

    },
    age: {
        type: Number,
        default:0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age cant be negative')
            }
        }

    },
    tokens : [{
        token :{
            type : String,
            required : true
        }
    }],
    
    avatart:{
        type : Buffer
    }
    
},{
    timestamps : true
})


userShcema.methods.generateAuthToken = async function(){

    const user = this

    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token

}


userShcema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await crypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}




userShcema.virtual('tasks',{
    ref : 'Task',
    localField : '_id',
    foreignField: 'owner'
})


userShcema.methods.toJSON = function(){
    const user = this 
    const userOject = user.toObject()

    delete userOject.password
    delete userOject.tokens
    delete userOject.avatar

    return userOject
}


// HASH PASSWORD

userShcema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await crypt.hash(user.password,8)
    }

    next()
})

// Delete users tasks when user is removed

userShcema.pre('remove',async function(next){
    const user = this 
    await Task.deleteMany({owner : user._id})

    next()
})


const User = mongoose.model('User',userShcema)

module.exports = User