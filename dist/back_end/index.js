let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let ObjectId = require('mongodb').ObjectID;
let bodyParser = require('body-parser');
let db;


let rootURL = '/';
let dataRootURL = 'mongodb://localhost:27017'
let dbName = 'myProject';
let app = express();
let client = new MongoClient(dataRootURL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extented: true}));
app.use(function(req, res, next) {
    // req.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //Работает только так:
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
})
// app.get('/', (req, res) => {
//     res.send('<h1>HOME PAGE</h1>')
// })


app.get(rootURL + 'cities', (req, res) => {
    db.collection('cities').find().toArray((err, docs) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs)
    })
})
app.delete(rootURL + ':id', (req, res) => {
    db.collection('cities').deleteOne({_id: ObjectId(req.params.id)}, (err, docs) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.sendStatus(200);
    })
})
app.post(rootURL + 'add', (req, res) => {
    if (req.body.name) {
        let city = {
            name: req.body.name
        }
        db.collection('cities').insertOne(city, (err, result) => {
            if (err) {
                return res.sendStatus(500);
            } else {
                res.send(result.ops[0]._id);
            }
        })
    }

})
app.put(rootURL + ':id', (req, res) => {
    db.collection('cities').updateOne({_id: ObjectId(req.params.id)}, {$set: {
        name: req.body.name
        }}, (err) => {
        if (err) {
            return res.sendStatus(500);
        }
        res.sendStatus(200);

    })
})


client.connect(function (err) {
    console.log('Connected successfully to server...');

    db = client.db(dbName);
    app.listen(3333, () => {
        console.log('API started');
    });
})