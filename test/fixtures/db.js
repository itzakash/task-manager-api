const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const Users = require('../../src/models/user');
const Tasks = require('../../src/models/tasks')

const userOneID = mongoose.Types.ObjectId();
const userOne = {
    "_id": userOneID,
    "name": "sky",
    "email": "skytalawar@gmail.com",
    "password": "akash@1995",
    "age": 24,
    "tokens": [
        {
            token: jwt.sign({ _id: userOneID }, process.env.JWT_TOKEN)
        }
    ]
}




const userTwoID = mongoose.Types.ObjectId();
const userTwo = {
    "_id": userTwoID,
    "name": "sky",
    "email": "userTwo@gmail.com",
    "password": "akash@1995",
    "age": 24,
    "tokens": [
        {
            token: jwt.sign({ _id: userTwoID }, process.env.JWT_TOKEN)
        }
    ]
}


const taskOne = {
    "_id": mongoose.Types.ObjectId(),
    "description": "User One Task One",
    completed: true,
    user_id: userOneID
}


const taskTwo = {
    "_id": mongoose.Types.ObjectId(),
    "description": "User One Task Two",
    completed: true,
    user_id: userOneID
}


const taskThree = {
    "_id": mongoose.Types.ObjectId(),
    "description": "User One Task Three",
    completed: true,
    user_id: userTwoID
}



const setUpDB = async () => {
    await Users.deleteMany()
    await new Users(userOne).save();
    await new Users(userTwo).save();
    await Tasks.deleteMany();
    await new Tasks(taskOne).save()
    await new Tasks(taskTwo).save()
    await new Tasks(taskThree).save()

}


module.exports = {
    userOneID,
    userOne,
    userTwoID,
    userTwo,
    taskOne,
    taskThree,
    taskTwo,
    setUpDB
}