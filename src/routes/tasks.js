const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middlewares/auth')


// Get /tasks?completed=true&false
// Get /tasks?limit=10&skip=3
// Get /tasks?sortBy=createdAt : desc

router.get('/tasks',auth, async (req, res) => {

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
    }

    try {

        await req.user.populate({
            path : 'tasks',
            match ,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort : {
                    completed : 1
                }
            }
        })
        res.send(req.user.tasks)

    } catch (error) {
        res.status(404).send()
    }

})

router.get('/tasks/:id',auth, async (req, res) => {
    const _id = req.params.id

    try {

        // const task = Task.findById(_id)

        const task = await Task.findOne({_id,owner : req.user._id})

        if (!task) {
            return res.status(404).send('error')
        }
        res.send(task)
    } catch (error) {
        res.status(404).send()
    }


})

router.post("/tasks",auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {

        await task.save()
        res.status(201).send(task)

    } catch (error) {
        res.status(404).send()
    }
})

router.patch('/tasks/:id',auth, async (req, res) => {

    const uptades = Object.keys(req.body)
   

    if (!isValid) {
        return res.status(404).send({ error: 'Invalid request' })
    }

    const allowedUpt = ['description', 'completed']
    const isValid = uptades.every((uptade) => allowedUpt.includes(uptade))

    try {

        const task = await Task.findOne({_id:req.params.id, owner : req.user._id})
        

        uptades.forEach((uptade)=>task[uptade]=req.body[uptade])
        await task.save()
        
        res.status(200).send(task)

    } catch (error) {
        return error
    }
})

router.delete('/tasks/id',auth, async (req, res) => {

    try {

        const task = await Task.findOneAndDelete({_id: req.params.id,owner : req.params._id})
        if (!user) {
            throw new Error('invalid id')
        }
        res.status(200).send(user)
    } catch (error) {
        return error
    }

})


module.exports = router


