//Required Packages
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let fetch = require('node-fetch');

//Body Parser
app.use(bodyParser.json());

//Requried Variables
let lastClientId = 0;
let clients = [];

app.post('/clients',(req,res,next) =>{
    lastClientId++
    newClient = {
        'name' : req.body.name,
        'clientId' : lastClientId,
        'lat':"",
        'long' : "",
        'location' : ""
    }
    clients.push(newClient);
    return res.send(newClient);
})

app.post('/locations',(req,res,next) => {
    let client = clients.find(function(client){
        if(req.body.id == client.id )
            return client;
    });

    fetch('http://nominatim.openstreetmap.org/reverse?format=json&lat=30.2689161&lon=-97.740671999999997&zoom=18&addressdetails=1', 
    { 
        method: 'GET', 
        headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36"
        }
    })
    .then(res => res.json())
    .then(json => {
        client.lat = json.lat;
        client.long = json.long;
        client.location = json.location;
        console.log(json)
    });

    return res.send(client);

})

app.get('/locations',(req,res,next)=>{
    return res.send(clients);
})



app.listen(6767, (err)=> {
    if(err) {
        console.log("Error",err);
    }
    console.log("Starting up Webserver")
})