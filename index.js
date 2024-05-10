require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
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

// async function run() {
//   try {
//       const foodCollection = client.db('foodMahalDB').collection('foodCollection');
//       app.get('/allfoods', async(req, res) => {
//           const cursor = await foodCollection.find().toArray();
//           res.send(cursor);

//       })
    
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
    
//   }
// }
// run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Food is running");
});
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
