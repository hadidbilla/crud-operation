const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const password = "RXp9sr!tKr6wWRj";
const username = "crud-operation";
const uri =
  "mongodb+srv://crud-operation:RXp9sr!tKr6wWRj@cluster0.zta4c.mongodb.net/crudOperationdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const collection = client.db("crudOperationdb").collection("products");
  /*---------- (Get All Data Method) ----------------*/
  app.get("/products", (req, res) => {
    collection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });
  /*----------- (Get Single Data Method) --------------*/
  app.get("/products/:id", (req, res) => {
    collection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });
  /*---------- (Post Method) ---------------*/
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product);
    collection.insertOne(product).then((result) => {
      res.redirect("/");
    });
  });
  /*----------- (Post Update Method) -----------------*/
  app.patch("/update/:id", (req, res) => {
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });
  /*------------ (Delete Method) ------------*/
  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });
});

app.listen(3000);
