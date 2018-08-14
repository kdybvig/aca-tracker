const express = require('express');
const app = express();
const PORT = process.env.PORT || 3333;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.json());
app.use(express.static('public'));

let lastClientId = 0;
const clients = [];

app.post('/clients', (req, res, next) => {
    /*if(Object.keys(req.body).length !== 1 || Object.keys(req.body)[0] !== 'name') {
        res.status(404).send('Post request failed.')
        return;
    }*/
    console.log(req.body, Object.keys(req.body));
    lastClientId ++;
    const defClient = {clientId:lastClientId,lat:"",long:"",location:""}
    const newClient = Object.assign(defClient, req.body);
    clients.push(newClient);
    res.json(clients[clients.length -1])
});

app.post('/locations', (req,res, next) => {
    /* const locKeys = ['id', 'lat', 'long'];
    const bodyKeys = Object.keys(req.body).sort();
    if(JSON.stringify(locKeys) !== JSON.stringify(bodyKeys)) {
        res.status(404).send('Post request failed.')
    } */
    console.log('body:', req.body, '  id:', req.body.id)
    const idIndex = clients.findIndex(client => client.clientId === parseInt(req.body.id));
    if(idIndex === -1) {
        res.status(404).send('User not found.');
        return;
    }
    const client = Object.assign({},clients[idIndex]);
    const urlBase = 'http://nominatim.openstreetmap.org/reverse?format=json&'
    const lat = req.body.lat;
    const long = req.body.long;
    const addOpt = '&zoom=18&addressdetails=1'
    let location = '';

    fetch(`${urlBase}lat=${lat}&lon=${long}${addOpt}`, 
    { 
    method: 'GET', 
    headers: {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
    }
    })
    .then(res => res.json())
    .then(json => {
    const locationInfo = {location: json.address, long: long, lat: lat};
    const newClient = Object.assign(client, locationInfo);
    clients[idIndex] = newClient
    res.json(newClient);
    return;
    });
})


app.get('/clients', (req, res) => res.status(200).json(clients));
app.get('/locations', (req, res) => res.json(clients));

app.listen(PORT, (err) => {
    if(err) {
        return err
    } else {
        console.log(`Server is listening on ${PORT}`);
    }
});