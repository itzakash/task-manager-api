const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
  },
  {
    timestamps: true,
  }
);

//hide the private data like all tokens,password etc..
taskSchema.methods.toJSON = function () {
  const task = this;
  const taskObject = task.toObject();
  delete taskObject.__v;
  return taskObject;
};

taskSchema.plugin(mongoosePaginate);
const Tasks = mongoose.model('Tasks', taskSchema);

module.exports = Tasks;
