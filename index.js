const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xohwd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        const database = client.db("uniqueShop");
        const productsCollection = database.collection("products");
        const usersCollection = database.collection('users');


        //GET API for all the products\ showing UI
        app.get("/products", async (req, res) => {
            const result = productsCollection.find({});
            const products = await result.toArray();
            res.send(products);

        })
        //Get API for certain product by id
        app.get("/products/:id", async (req, res) => {
            const productDetails = await productsCollection.findOne({ _id: ObjectId(req.params.id) });
            res.send(productDetails)

        })

        //POST API- all users siging with email
        app.post('/users', async (req, res) => {
            const users = await usersCollection.insertOne(req.body);
            res.json(users);
        });

        //PUT API -user
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('Co-op Battle Team 09!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})