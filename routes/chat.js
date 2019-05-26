const  express  = require("express");
const  Chat  = require("../model/chat");

const  router  =  express.Router();

router.get('/:id', (req, res, next) =>  {
        console.log(req.params.id);
        res.setHeader("Content-Type", "application/json");
        res.statusCode  =  200;
        
        Chat.find({}).then(chat  =>  {
            console.log('inside router ');
            console.log(chat);
            res.json(chat);
        });    
});

module.exports  =  router;