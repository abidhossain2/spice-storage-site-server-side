const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.congk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const ProductCollection = client.db("spice").collection("products");
        const MyItems = client.db("spice").collection("myitems")
         console.log('db connected');
        app.get('/products', async(req, res) => {
            const query = {};
            const cursor = ProductCollection.find(query)
            const result = await cursor.toArray()
            res.send(result);
        })
        app.get('/myitems', async(req, res) => {
            const loginUser = req.query.email;
            const query = {email: loginUser};
            const cursor = MyItems.find(query)
            const result = await cursor.toArray()
            res.send(result);
        })
        app.post('/myitems', async(req, res) => {
            const query =req.body;
            const result = MyItems.insertOne(query)
            // const result = await cursor.toArray()
            res.send(result);
        })
        app.post('/products', async(req, res) => {
            const query = req.body;
            const result = await ProductCollection.insertOne(query)
            // const result = await cursor.toArray()
            res.send(result);
        })

        app.delete('/inventory/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await ProductCollection.deleteOne(query)
            res.send(result)
        })
       
        app.delete('/myitems/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await MyItems.deleteOne(query)
            res.send(result)
        })
        
       

        app.get('/inventory/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await ProductCollection.findOne(query)
            res.send(result)
        })
        // app.get('/inventory/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = {_id: ObjectId(id)}
        //     const result = await MyItems.findOne(query)
        //     res.send(result)
        // })
        
        app.get('/myitems/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await MyItems.findOne(query)
            res.send(result)
        })

       app.put('/inventory/:id', async (req, res) => {
           const id = req.params.id;
           const amount =  req.body;
           const query = {_id: ObjectId(id)};
           const amountOption =  {upsert: true};
           const updateAmount = {
               $set: {
                   quantity: amount.quantity - 1
                }
            }
            const result = await ProductCollection.updateOne(query, updateAmount, amountOption);
            res.send(result);
       })


    }
    finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello')
})

app.listen(port, () => {
    console.log('Listening', port);
})