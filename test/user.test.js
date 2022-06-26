
const request = require('supertest')
const app = require('../src/app')
const Users = require('../src/models/user');
const {
    userOneID,
    userOne,
    setUpDB
} = require('./fixtures/db')


beforeEach(setUpDB)

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

test('Should login existig user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await Users.findById(userOneID);
    // console.log(user)
    expect(response.body.token).toBe(user.tokens[1].token)
})

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


    const response = await Users.findById(userOneID);

    expect(response).toBeNull()
})



test('Should not delete unauthenticated user Account', async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401)
})


test('Should upload avatar image', async () => {
    const response = await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/Profile.jpg')
        .expect(200)

    const user = await Users.findById(userOneID);

    expect(user.avatar).toEqual(expect.any(Buffer))


})


test('Should update valid user', async () => {
    const response = await request(app).patch('/users/me').send({
        "name": "itzAkash",
        "age": 25,
        "password": "akash1995"
    }).set('Authorization', `Bearer ${userOne.tokens[0].token}`).expect(200)

    const user = await Users.findById(userOneID);

    expect(user.name).toEqual('itzAkash')
})


test('Should update valid user', async () => {
    const response = await request(app).patch('/users/me').send({
        "location": "itzAkash",

    }).set('Authorization', `Bearer ${userOne.tokens[0].token}`).expect(400)

})



