const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useCreateIndex: true,
});

const Tasks = mongoose.model('Tasks', {
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});
const t = new Tasks({
  description: 'Learned the node',
  completed: true,
});

t.save()
  .then((result) => {
    console.log(result);
  })
  .catch((e) => {
    console.log('Error ! ', e.errors.description.properties.message);
  });

// user validators

// const me = new Users({
//   name: '  itzakash',
//   email: 'SKYTALAWAR@gmail.com',
//   password: '  1123  ',
// });
// me.save()
//   .then((result) => {
//     console.log('One record inserted ', result);
//   })
//   .catch((error) => {
//     if (error.errors['name']) {
//       console.log(error.errors['name'].message);
//     }

//     if (error.errors['email']) {
//       console.log(error.errors['email'].message);
//     }
//     if (error.errors['age']) {
//       console.log(error.errors['age'].message);
//     }

//     if (error.errors['password']) {
//       console.log(error.errors['password'].message);
//     }
//   });
