const express = require('express');

const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());


const port =process.env.PORT ||  5000;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggzrw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

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
app.post('/addAdmin', (req, res) => {
  
      const email = req.body.email;
      console.log(email)
   
    
      adminCollection.insertOne({ email})
          .then(result => {
              res.send(result.insertedCount > 0);
          })
    }) 
    // app.post('/addAdmin', (req, res) => {
   
    //     const email = req.body.email;
    //     adminCollection.find({ email: email })
    //         .toArray((err, service) => {
    //             const filter = { date: date.date }
    //             if (service.length === 0) {
    //                 filter.email = email;
    //             }
    //          collection.find(filter)
    //                 .toArray((err, documents) => {
    //                     console.log(email, date.date, service, documents)
    //                     res.send(documents);
    //                 })
    //         })
    
    // })
app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
        .toArray((err, admins) => {
            res.send(admins.length > 0);
        })
  })
});




app.listen(process.env.PORT || port)