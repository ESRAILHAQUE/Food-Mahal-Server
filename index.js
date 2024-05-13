require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// middleware
//Must remove "/" from your production URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://sensory-fution.web.app",
      "https://sensory-fution.firebaseapp.com"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

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
// middleware
const logger = (req, res, next) => {
    console.log('log info', req.method, req.url);
    next();
}

// Token verify
const verifyToken = (req, res, next) => {
    const token = req?.cookies?.token;
    console.log('token in the middleware', token)
    if (!token) {
        return res.status(401).send({message: 'unauthorized access'})
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: 'unauthorized access'})
        }
        req.user = decoded;
        next();
    })
    // next();
}
const cookieOption = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure:process.env.NODE_ENV === "production" ? true :false
};

async function run() {
  try {
    const foodCollection = client
      .db("foodMahalDB")
      .collection("foodCollection");
    const addedCollection = client
      .db("foodMahalDB")
      .collection("addedCollection");
    const bookingsCollection = client
      .db("foodMahalDB")
      .collection("bookingsCollection");
    const galleryCollection = client
      .db("foodMahalDB")
      .collection("galleryCollection");

    // auth related api
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })
        .send({ success: true });
    });
    app.post("/logout", async (req, res) => {
      const user = req.body;
      console.log("loggin out", user);
      res
        .clearCookie("token", { ...cookieOption, maxAge: 0 })
        .send({ success: true });
    });

    //   Services related api
    app.get("/allfoods", async (req, res) => {
      const cursor = await foodCollection.find().toArray();
      res.send(cursor);
    });
    app.get("/allfoods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });
    // Increment purchase count for a food item
    app.post("/increment/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await foodCollection.updateOne(query, {
          $inc: { count: 1 },
        });
        res.send(result);
      
    });

    app.get("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });
    app.get("/addeditems/:id", async (req, res) => {
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
    app.post("/gallery", async (req, res) => {
      const data = req.body;
      const result = await galleryCollection.insertOne(data);
      res.send(result);
    });
    app.get("/gallerypic", async (req, res) => {
      const cursor = await galleryCollection.find().toArray();
      res.send(cursor);
    });
    app.post("/bookings", async (req, res) => {
      const data = req.body;
      const result = await bookingsCollection.insertOne(data);
      res.send(result);
    });
    app.get("/addeditems", verifyToken, async (req, res) => {
      if (req.user.email !== req.query.email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = await addedCollection.find(query).toArray();
      res.send(cursor);
    });
    app.get("/bookingsitem", verifyToken, async (req, res) => {
      console.log(req.query.email);
      console.log("token owner info", req.user);
      if (req.user.email !== req.query.email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });
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
