const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggzrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();

app.use(express.json());
app.use(cors());


const port =process.env.PORT ||  5000;





app.get('/', (req, res) => {
    res.send("hello from db it's working ")
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("blog").collection("blogPost");
  const adminCollection = client.db("blog").collection("admin");
;

app.get('/newPost', (req, res) => {
    collection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})
app.get('/newService', (req, res) => {
    collection.find()
    .toArray((err, items) => {
        res.send(items)
    })
})


  app.post('/addPost', (req, res) => {
    const addPost = req.body;
    console.log('adding new event: ', addPost);
    collection.insertOne(addPost)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})
app.post('/addReview', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event: ', newEvent)
    collection.insertOne(newEvent)
    .then(result => {
        console.log('inserted count', result.insertedCount);
        res.send(result.insertedCount > 0)
    })
})
app.post('/addAdmin', (request, res) => {
  

    const email = request.body.email;
    const password = request.body.password;
    console.log(email,password)
 
    adminCollection.insertOne({  email ,password})
        .then(result => {
            res.send(result.insertedCount > 0);
        })
        adminCollection
      .find({ email: request.body.email })
      .toArray()
      .then((result) => {
        if (result.length < 1) {
          console.log("user not found");
          return res.send(false);
        }
        adminCollection
          .find({ password: request.body.password })
          .toArray()
          .then((documents) => {
            if (documents.length < 1) {
              console.log("password not found");
              return res.send(false);
            } else {
              res.send(true);
              console.log("successfully logged in");
            }
          });
      })
})
app.post("/adminLogin", (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);
    adminCollection
      .find({ email: req.body.email })
      .toArray()
      .then((result) => {
        if (result.length < 1) {
          console.log("user not found");
          return res.send(false);
        }
        adminCollection
          .find({ password: req.body.password })
          .toArray()
          .then((documents) => {
            if (documents.length < 1) {
              console.log("password not found");
              return res.send(false);
            } else {
              res.send(true);
              console.log("successfully logged in");
            }
          });
      });
  });
  

app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admins) => {
            res.send(admins.length > 0);
        })
  })

  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectId(req.params.id);
    collection.findOneAndDelete({_id: id})
    .then(product => res.send(product.value))
})

// client.close();
});




app.listen(process.env.PORT || port)