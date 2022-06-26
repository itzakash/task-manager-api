const request = require('supertest')
const app = require('../src/app')

const Task = require("../src/models/tasks")

const {
    userOneID,
    userOne,
    userTwoID,
    userTwo,
    taskOne,
    taskThree,
    taskTwo,
    setUpDB
} = require('./fixtures/db')


beforeEach(setUpDB)


test('Should Create task For user', async () => {
    const response = await request(app).post('/tasks').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send({
        "description": "Create USer Taks",
        completed: true,
        user_id: userOneID
    }).expect(200)

    const task = await Task.findById(response.body._id);

    expect(task).not.toBeNull();
})


test('Get all task of user One', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)

    // console.log(response.body.length)
    expect(response.body.length).toEqual(2)
})


test('Delete task one from user two', async () => {
    const response = await request(app)
        .delete(`/task/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .expect(404)

    const task = await Task.findById(taskOne._id)
    // console.log(task)
    expect(task).not.toBeNull()
})