const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
  const todos = await loadTodosCollection();
  res.send(await todos.find({}).toArray());
});

router.post("/", async (req, res) => {
  const todos = await loadTodosCollection();
  await todos.insertOne({
    title: req.body.title,
    completed: req.body.completed,
  });
  res.status(201).send();
})

router.delete("/:id", async (req, res) => {
  const todos = await loadTodosCollection();
  await todos.deleteOne({ _id: new mongodb.ObjectID(req.params.id) })
  res.status(200).send();
});

router.patch('/:id', async (req, res) => {
  const updateDoc = { $set: { completed: req.body.completed } }
  const todos = await loadTodosCollection();
  await todos.updateOne({ _id: new mongodb.ObjectID(req.params.id) }, updateDoc)
  res.status(201).send();
})

async function loadTodosCollection() {
  const client = await mongodb.MongoClient.connect('mongodb+srv://gilli:1234@cluster1.rwqru.mongodb.net/testing?retryWrites=true&w=majority', { useNewUrlParser: true })
  return client.db("testing").collection("todos");
}

module.exports = router;