const express = require('express');
const app = express();
const port = 3000;
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser');


let db;
let collection;
MongoClient.connect('mongodb://localhost/api', { 
        useNewUrlParser: true, 
        useUnifiedTopology: true }, (err, client) => {
            /*condicional para conectarse a la BD */
            if (err) return console.error(err)
            console.log('Conectado a la base de datos')
            db = client.db('api')
            collection = db.collection('clientes')
})

app.use(bodyParser.json());
/* para obtener los datos */
app.get('/clientes', (req, res) => {
        db.collection('clientes').find().toArray()
            .then(results => {
                res.json(results);
            }).catch(error => console.error(error));
    })
    /* craer un nuevo dato */
app.post('/clientes', (req, res) => {
    collection.insertOne(req.body)
        .then(result => {
            res.json('Cliente Creado');
        })
        .catch(error => console.error(error))
})


app.put('/clientes/:id', (req, res) => {
    collection.findOneAndUpdate({ name: req.params.id }, {
            $set: {
                name: req.body.name,
                LastName: req.body.price,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                zipcode: req.body.zipcode,
                country: req.body.country
            }
        }, {
            upsert: true
        }).then(result => { res.json('Actualizado') })
        .catch(error => console.error(error))

});
/* eliminar cliente */
app.delete('/clientes/:id', (req, res) => {
    collection.deleteOne({ name: req.params.id })
        .then(result => {
            res.json('Eliminado')
        })
        .catch(error => console.error(error))
})



app.listen(port, function() {
    console.log('Escuchando en el puerto ' + port)
});