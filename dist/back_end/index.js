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
let fs = require('fs').promises;
let path = '/Users/antonstilet/Desktop/final_project/dist';
app.use(express.static("/Users/antonstilet/Desktop/final_project/dist"));
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extented: true}));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
})


app.get('/', function(req, res) {
    fs.readFile(path + "/public/index.html")
        .then(contents => {
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
        })

});
app.get('/styles/style.css', function(req, res) {
    res.sendFile(path + "/public/styles/style.css");
});
app.get('/bundle.js', function(req, res) {
    res.sendFile(path + "/public/bundle.js");
});
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

// serve application
// let express = require('express');

// let app = express();


// app.listen(3333);
// console.log('server is running')