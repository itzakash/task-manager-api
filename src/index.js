const express = require('express');
const userRouters = require('./routers/users');
const taskRouters = require('./routers/tasks');

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {

//   if (req.method === 'GET') {
//     res.send('Get requests are disabled..');
//   } else {
//     next();
//   }
// });

app.use(express.json());
app.use(userRouters);
app.use(taskRouters);

app.get('/', (req, res) => {
  res.send('Working');
});

app.listen(port, () => {
  console.log(' Server is up on port : ', port);
});

// const jwt = require('jsonwebtoken');

// const generateAuthtoken = async () => {
//   const token = jwt.sign({ _id: 'abc' }, 'akash');
//   // console.log(token);
// };

// generateAuthtoken();
/*const Task = require('./models/tasks');
const User = require('./models/user');
const main = async () => {
  // console.log('Hello');
  // const tasks = await Task.findById('5f54c522456d9f06a8f37a21');
  // await tasks.populate('user_id').execPopulate();
  // console.log(tasks.user_id);

  const user = await User.findById('5f54c519456d9f06a8f37a1f');
  await user.populate('tasks').execPopulate();
  console.log(user.tasks);
};*/

const multer = require('multer');
const upload = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    // if (!file.originalname.endsWith('.pdf')) {
    //   cb(new Error('File must be a PDF'));
    // }
    // with RegExp

    if (!file.originalname.match(/\.(doc|docx)$/)) {
      return cb(new Error('Please Upload a Doc or docx file'));
    }

    cb(undefined, true);
    // cb(new Error(' File must be a PDF'));
    // cb(undefined, true);
    // cb(undefined, false);
  },
});

app.post(
  '/upload',
  upload.single('upload'),
  (req, res) => {
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
// main();
