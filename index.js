//create an express.js server with socket.io and listen on port 3000
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server,{
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
var wrtc = require('wrtc');
var cors = require('cors');
var roomManager = require('./roomManager.js');
var LastFM = require('last-fm');
var RoomManager = new roomManager();
var user = require('./user.js');
var SimplePeer = require('simple-peer');


var port = process.env.PORT || 3000;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
// use cors to allow cross origin resource sharing
app.use(cors({ origin: '*' }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
   // Add this
   if (req.method === 'OPTIONS') {
  
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
        res.header('Access-Control-Max-Age', 120);
        return res.status(200).json({});
    }
  
    next();
  
  });

// /api/genres will return a list of genres
app.get('/api/genres', function (req, res) {
// use the LastFM API to get a list of genres
    var lastfm = new LastFM('39072f977963d36059f1e612f5b02322');
lastfm.chartTopTags({ limit: 32 }, function (err, data) {
    // send the list of genres as JSON
   // console.log(`${JSON.stringify(data.tag)}`);
    res.json(data);
});
});

io.set('origins', '*:*');
// on socket connect, send a message
io.sockets.on('connection', function (socket) {

    // on socket disconnect
    socket.on('disconnect', function () {
        // check all the rooms, if the rooms owner is the user that disconnected, remove the room
        for (var i = 0; i < RoomManager.rooms.length; i++) {
            console.log(RoomManager.rooms[i].owner.socket.id);
            console.log(socket.id);
            if (RoomManager.rooms[i].owner.socket.id == socket.id) {
            // remove the room from the room list
            console.log(`Room ${RoomManager.rooms[i].id} removed because owner disconnected ${socket.id}`);
                RoomManager.rooms.splice(i, 1);
                
            }
        }

   });

    console.log('A new user connected!');
    
    // on socket 'createRoom' event, create a room with the socket id as the owner
    socket.on('create', function (data) {
        
        
        //create a new user with the socket and a new peer object
        var User = new user(socket, new SimplePeer({ initiator: true, trickle: false, wrtc: wrtc }));
        var room = RoomManager.addRoom(User);
        User.setRoom(room);
        //add the user to the room
        socket.emit('created', room.id);
       socket.emit('addedPeer');

        
    });

    // on socket 'join', select the room at index 0 and join it
    socket.on('join', function (data) {
        //get the room by id
        var room = RoomManager.getRooms().at(0); 
        //create a new user with the socket and a new peer object
        var User = new user(socket, new SimplePeer({ initiator: true,trickle: true, wrtc: wrtc,config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302'},{urls: 'turn:71.167.186.97:3478',username: 'setu',credential: 'setu'}] } }));
        User.setRoom(room);
        //add the user to the room
        room.addPeer(User);
        //socket.emit('joined', room.id);
        socket.emit('addedPeer');
    });


});
