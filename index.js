const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const res = require('express/lib/response');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const fileUpload = require('express-fileupload');


/*========= Middleware============== */
app.use(cors());
app.use(express.json());
app.use(fileUpload());

/*MongoDB conncetion details */
const uri = `mongodb+srv://${process.env.ADMIN}:${process.env.PASSWORD}@cluster0.oulrk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();
        const database = client.db("tier5");
        const facebookUsersCollection = database.collection('facebook_posts');
        const instaUsersCollection = database.collection('insta_posts');

        /* =========User data Post api for save user email,name,role, in db=== */
        app.post('/facebook-users', async (req, res) => {
            const user = req.body;
            user.role = 'user';
            user.status = 1;
            const result = await facebookUsersCollection.insertOne(user)
            res.send(result)
        });

        //Get all user
        app.get('/facebook-posts', async (req, res) => {
            const posts = facebookUsersCollection.find({});
            const result = await posts.toArray();
            res.json(result);
        })
        //Get all user
        app.get('/insta-posts', async (req, res) => {
            const posts = instaUsersCollection.find({});
            const result = await posts.toArray();
            res.json(result);
        })

        //Get user by email
        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await facebookUsersCollection.findOne(query);
            res.json(user);
        })
        //Get post by email
        app.get('/facebook-post/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await facebookUsersCollection.findOne(query);
            // let isAdmin = false;
            // if (user?.role === 'admin') {
            //     isAdmin = true;
            // }
            res.json(user);
        })


        //update comment
        app.put('/facebook-posts/comment/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const data = req.body;
            const comment = { comment: data }
            const updateDoc = { $set: comment };
            const updatedPost = await facebookUsersCollection.updateOne(filter, updateDoc);
            res.json(updatedPost);
        });


    }
    finally {
        //   await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Welcome to tier5 facebook!')
})

app.listen(port, () => {
    console.log(`listening at :${port}`)
})