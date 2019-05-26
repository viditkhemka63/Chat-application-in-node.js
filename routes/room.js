var express = require('express');
var router = express.Router();
var Room = require('../model/room');
var Chat = require('../model/chat');

router.post('/createRoom', function(req, res) {
    
    console.log(req.body);

    var room = new Room({
        name: req.body.roomName
    });

    room.save((err, doc) => {
        if(err) throw err;

        console.log(doc);
        res.json(doc);
    })
});

router.get('/showRoom/:id', (req, res) => {

    console.log('working');
    console.log(req.params.id);

    Chat.find({roomId: req.params.id}, (err, data) => {
        if(err) throw err;

        console.log(data);

        res.render('chat', {roomId: req.params.id, chats: data, user: req.user});
    })
})

module.exports = router;
