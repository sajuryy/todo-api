const _ = require('lodash');
const { ObjectID } = require('mongodb');
const { Todo } = require('./../models/Todo');
const { authenticate } = require('./../middleware/authenticate');

module.exports = app => {
  // create todo
  app.post('/todos', authenticate, async (req, res) => {

    const todo = new Todo({
      text: req.body.text,
      _creator: req.user._id
    });

    try {
      const doc = await todo.save();
      res.send(doc);
    } catch (e) {
      res.status(400).send(e);

    }
  });
  // get all todos
  app.get('/todos', authenticate, async (req, res) => {

    try {
      const todos = await Todo.find({
        _creator: req.user._id
      });
      res.send({ todos });
    } catch (e) {
      res.status(400).send(e);
    }
  });
  // find todo by id
  app.get('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    try {
      const todo = await Todo.findOne({
        _id: id,
        _creator: req.user._id
      });

      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    } catch (e) {
      res.status(400).send();
    }
  });
  // delete todo
  app.delete('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    try {

      const todo = await Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
      });
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    } catch (e) {
      res.status(400).send();

    }
  });
  //update totod
  app.patch('/todos/:id', authenticate, async (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    try {
      const todo = await Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
      }, { $set: body }, { new: true });
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });

    } catch (e) {
      res.status(400).send();

    }
  });
};