const express = require("express");
require("../db/mongoose");
const mongoose = require("mongoose");
const Tasks = require("../models/tasks");
const { update } = require("../models/tasks");
const auth = require("../middleware/auth");
const router = new express.Router();

// create a tasks

router.post("/tasks", auth, async (req, res) => {
  // const task = new Tasks(req.body);
  const task = new Tasks({
    ...req.body,
    user_id: req.user._id,
  });
  try {
    await task.save();
    res.send(task);
  } catch (error) {
    res.status(500).send(e);
  }
});

// Get all tasks old code

/*
router.get('/tasks', auth, async (req, res) => {
  try {
    await req.user.populate('tasks').execPopulate();
    res.send(req.user.tasks);
  } catch (error) {
    res.status(500).send(error);
  }
});
*/

// Get completed = false /task?completed=true
// Get sort by /tasks?sortBy=createdAt:desc
// Pagination /task?limit=2&skip=3
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  const limit = parseInt(req.query.limit) || "";
  const skip = parseInt(req.query.skip) || "";

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const splitSort = req.query.sortBy.split(":");
    sort[splitSort[0]] = splitSort[1] === "desc" ? -1 : 1;

    console.log(splitSort);
  }

  try {
    const tasks = await Tasks.find({ user_id: req.user._id })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    res.send({ tasks: tasks });
  } catch (error) {
    console.log(error);
  }
});

router.get("/task/:id", async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);

    if (!task) return res.status(404).send({ body: "No Data Found" });

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updateBody = ["completed", "description"];

  const isValidator = updates.every((update) => updateBody.includes(update));

  if (!isValidator) {
    return res.status(400).send({ Error: "Invalid Updates!" });
  }

  try {
    // const task = await Tasks.findById(req.params.id);
    const task = await Tasks.findOne({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!task) {
      return res.status(404).send(req.user._id);
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();

    return res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/task/:id", auth, async (req, res) => {
  const tasks = await Tasks.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!tasks) {
    return res.status(404).send();
  }

  res.send(tasks);
});

router.post("/tasks1", auth, async (req, res) => {
  console.log(req);
  const tasks = await Tasks.find({
    user_id: req.user._id,
    description: new RegExp(".*" + req.body.word + ".*", "i"),
  });

  if (!tasks) {
    return res.status(404).send();
  }

  console.log(tasks);

  res.send(tasks);
});

module.exports = router;
