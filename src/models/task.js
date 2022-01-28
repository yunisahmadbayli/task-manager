const mongoose = require('mongoose')
const crypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true

    },
    completed: {
        type: Boolean,
        default: false
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    }
},{
    timestamps : true
})


taskSchema.pre('save',async function(next){
    const task = this

    if(task.isModified)

    next()
})

const Task = mongoose.model('Task',taskSchema)



module.exports = Task