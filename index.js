const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2rwge.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const volunteersCollection = client.db("volunteers").collection("volunteer");
        const volunteersServices = client.db("volunteerServices").collection("service");

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = volunteersServices.find(query);

            if ((await cursor.count() === 0)) return res.send({ succuss: "no data found", message: "Please insert data then request for data!!" });

            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/addservice', async (req, res) => {
            const data = req.body;
            const result = await volunteersServices.insertOne(data);
            res.send(result);
        });
    }
    catch (error) {
        console.log(error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('volunteer network server running');
});

app.listen(port, () => {
    console.log('listening port,', port);
});
