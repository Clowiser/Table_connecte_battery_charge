//MQTT
const mqtt = require('mqtt');

//Connexion serveur - NodeJS
const app = require('express')();

//CSS & JS (à mettre en place car ne se chargeant à cause du MIME-type)
const express = require('express')
app.use(express.static('public')); // pour ensemble des fichiers CSS & JS dans dossier public
app.use(express.static(__dirname)); // pour le fichier serveur.js dans dossier base

//Websockets
const server = require('http').Server(app)
const io = require('socket.io')(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

server.listen(3000, function(){
    console.log('listening on 3000 avec Websockets');
});

//MySQL
const mysql = require('mysql2');

const con = mysql.createConnection({
    database: "table",
    host: "localhost",
    user: "root",
    password: "evol2Foi+smsql",
});

//Websocket
//établissement de la connexion
io.on('connection', function (socket){
    console.log(`Connecté au client ${socket.id}`)

    //TTN
    var options = {
        port: 1883,
        host: 'mqtt://eu.thethings.network',
        username: 'solaire-data-v1', //APPID - nom application
        password: 'NNSXS.IPGFMT3Y73PVO7DFVFHZCBNRRO2BHPRKEHCXZUY.XVCM5SNXC6L7SY2GC7G53VRFDCHDNBH7CWVUIYHPWRDJSEZG7YDQ' //API KEY
    };

    //MQTT - connexion MQTT + s'abonner au sujet + affichage des données reçues
    const client = mqtt.connect('mqtt://eu1.cloud.thethings.network:1883 ', options)
    const topic = 'v3/+/devices/+/up';


    //VOIR ICI AVEC DONNEES TTN + WEBSOCKET EN MM TPS
    client.on('connect', function () {
        console.log('Connected TTN')

        client.subscribe(topic, function(){
        console.log(`Subscribe to topic '${topic}'`)
        })

        client.on('message', (topic, payload) => {
            console.log("retour des données du topic de TTN : " + topic)
            //console.log('Received Message:', topic, payload.toString())
            let json = payload.toString();
            let obj = JSON.parse(json);
            console.log("réception données OK")
            console.log(obj.uplink_message.decoded_payload.bytes)
            let batteryCharge = obj.uplink_message.decoded_payload.bytes;

            //Envoi données Websocket
            io.emit('donneesBatterie', batteryCharge)
            console.log(batteryCharge)

            con.connect(function(err) {
                if (err) throw err;
                console.log("Connected MYSQL");
                
                //Vérifier que la table existe : si oui suppression
                const sql1 = "DROP TABLE IF EXISTS chargetable";
            
                con.query(sql1, function(err, results) {
                    if (err) throw err;
                    console.log("Table Chargetable supprimée");
                });
            
                //Créer la table Chargetable.
                var sql2 = "CREATE TABLE Chargetable " +
                    " (Id INT not null AUTO_INCREMENT, " +
                    " name VARCHAR(255), " +
                    " batteryCharge INT, " +
                    " PRIMARY KEY (Id) )";
            
                con.query(sql2, function(err, results) {
                    if (err) throw err;
                    console.log("Table Chargetable créée");
                });
            
                //Insérer les valeurs dans la table Chargetable
                let id = 0;
                let name = 'Données batterie';
            
                var sql3 = "INSERT INTO Chargetable (id, name, batteryCharge) VALUES ('" + id + "', '" + name + "','" + batteryCharge + "')";
            
                con.query(sql3, function(err, results) {
                    if (err) throw err;
                    console.log("Données OK");
                })
            
              });
            
        })

    })
});