
const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const Users = require('../src/models/user');

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

beforeEach(async () => {
    console.log('Calling Before')
    await Users.deleteMany()
    await new Users(userOne).save();
})

test('Should signup new User', async () => {
    const response = await request(app).post('/users').send({
        "name": "sky",
        "email": "akash@gmail.com",
        "password": "akash@1995",
        "age": 24
    }).expect(200)


    const user = await Users.findById(response.body.user._id);

    expect(user).not.toBeNull();


    expect(response.body).toMatchObject({
        user: {
            name: "sky",
            email: "akash@gmail.com"
        },
        token: user.tokens[0].token
    }
    )
    expect(user.password).not.toBe('akash@1995')
})



//Login Existing user

// test('Should login existig user', async () => )

test('Should Get profile for user', async () => {
    await request(app)
        .get("/users/profile")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(201)
})


test('Should not Get profile for unauthenticated user', async () => {
    await request(app)
        .get("/users/profile")
        .send()
        .expect(401)
})


test('Should delete user Account', async () => {
    await request(app)
        .delete("/users/me")
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})



test('Should not delete unauthenticated user Account', async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})


