const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 27485;
require('dotenv').config()

// MongoDB connect
const uri = `mongodb://${process.env.mongo_UserName}:${process.env.mongo_Password}@ac-jhe2rq3-shard-00-00.ja7anyt.mongodb.net:27017,ac-jhe2rq3-shard-00-01.ja7anyt.mongodb.net:27017,ac-jhe2rq3-shard-00-02.ja7anyt.mongodb.net:27017/?ssl=true&replicaSet=atlas-laaly2-shard-0&authSource=admin&retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // create a database and a collection
    const database = client.db('toysDB');
    const toysCollection = database.collection('toys');
    const testimonialsCollection = database.collection('testimonials');
    const blogsCollection = database.collection('blogs');

    //get api to get all the toys
    app.get('/toy', async (req, res) => {
      const result = await toysCollection.find().toArray();
      res.send(result)
    })

    //get api to get all the testimonials
    app.get('/testimonials', async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.send(result)
    })

    //get api to get all the blogs
    app.get('/blogs', async (req, res) => {
      const result = await blogsCollection.find().toArray();
      res.send(result)
    })

    app.get('/myToys/:email', async (req, res) => {
      const email = req.params.email;
      const query = { sellerEmail: email };
      const result = await toysCollection.find(query).toArray();
      res.send(result)
    })

    app.get('/toy/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query);
      res.send(result)
    })

    //post api to add a new toy
    app.post('/toy', async (req, res) => {
      const newToyData = req.body;
      const result = await toysCollection.insertOne(newToyData);
      console.log(newToyData);
      res.send(result)
    })

    //updating a toy data
    app.put('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const updatedData = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          price: updatedData.price,
          availableQuantity: updatedData.availableQuantity,
          description: updatedData.description
        },
      };
      const result = await toysCollection.updateOne(filter, updateDoc, options);
      // console.log(price, availableQuantity, description, id);
      res.send(result)
    })

    app.delete('/toy/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
      const result = await toysCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Database connected...");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('app is running!')
})


app.listen(port, () => {
  console.log('port is listening.')
})