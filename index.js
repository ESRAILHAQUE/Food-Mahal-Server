require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.p8g8qjz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
      const foodCollection = client.db('foodMahalDB').collection('foodCollection');
      const addedCollection = client.db('foodMahalDB').collection('addedCollection');
      const bookingsCollection = client.db('foodMahalDB').collection('bookingsCollection');
      app.get('/allfoods', async(req, res) => {
          const cursor = await foodCollection.find().toArray();
          res.send(cursor);

      })
      app.get("/allfoods/:id", async (req, res) => {
          const id = req.params.id;
          const query={_id: new ObjectId(id)}
         const result = await foodCollection.findOne(query)
         res.send(result);
      });
       app.get("/purchase/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const result = await foodCollection.findOne(query);
         res.send(result);
       });
      app.get("/addeditems/:id", async(req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = await addedCollection.findOne(query);
          res.send(result); 
      });
      app.post("/added", async (req, res) => {
          const data = req.body;
          const result = await addedCollection.insertOne(data);
          res.send(result);
      });
      app.post("/bookings", async (req, res) => {
          const data = req.body;
          const result = await bookingsCollection.insertOne(data);
          res.send(result);
      })
      app.get("/addeditems", async (req, res) => {
          let query = {};
          if (req.query?.email) {
              query={email: req.query.email}
          }
        const cursor = await addedCollection.find(query).toArray();
        res.send(cursor);  
      });
      app.get("/bookingsitem", async (req, res) => {
          let query = {};
          if (req.query?.email) {
              query={email: req.query.email}
          }
          const result = await bookingsCollection.find(query).toArray();
          res.send(result);
      })
      app.delete("/bookings/:id", (req, res) => {
          const id = req.params.id;
          const query = { _id: new ObjectId(id) };
          const result = bookingsCollection.deleteOne(query);
          res.send(result)
      })
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Food is running");
});
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
