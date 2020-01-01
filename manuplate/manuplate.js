let mod = require('../applibrary/localmodules');
var path = require("path")
var test = path.join(__dirname, '../asset/userpics');
exports.storage = mod.multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, test);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

exports.fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

exports.upload = mod.multer({
    storage: this.storage,
    limits: {
      fileSize: 52428800
    },
    fileFilter: this.fileFilter
});

var chat_schema = require('../schema/chat_schema')
var conversation_schema = require('../schema/coversation_schema')
var user_schema = require('../schema/user_schema')
exports.test = (req, res) => {
    res.json({ "status": "true", "connection": "active" })
    res.end();
}

exports.reg = (req, res) => {
    try {
        var user = new user_schema(req.body)
        user.save().then((result) => {
            res.json({ "result": result, "status": "success", "bool": true })
            res.end();
        })
    } catch (e) {
        res.json({ "error": e })
        res.end();
    }
}
exports.login = (req, res) => {
    try {
        user_schema.findOne(req.body).then(result => {
            if (result.length == 0) {
                res.json({ "user": false, "msg": "user Not found", "bool": true })
                res.end();
            } else {
                res.json(result)
                res.end();
            }
        })

    } catch (e) {
        res.json(e)
        res.end();
    }

}
exports.listusers = (req, res) => {
    try {
        user_schema.find({}).then(result => {
            if (result.length == 0) {
                res.json({ "user": false, "msg": "user Not found", "bool": true })
                res.end();
            } else {
                res.json(result)
                res.end();
            }
        })

    } catch (e) {
        res.json(e)
        res.end();
    }
}
exports.conversation = (req, res) => {
    try {

        console.log(req.body)
        conversation_schema.findOne({ "participants": { $all: [req.body['senderid'], req.body['receiverid']] } }).then(result => {
            console.log(result, "conversation ")
            if (result == null) {
                res.json({ "msg": "conversation Not found", "data": result, "bool": true })
                res.end();
            } else {
                console.log(result, "else")
                res.json(result)
                res.end();
            }
            res.end();
        })

    } catch (e) {
        res.json(e)
        res.end();
    }
}
exports.conversationdet = (req, res) => {
    try {

        console.log(req.body, "daily data")
        chat_schema.find(req.body).then(result => {
            // console.log(result, "conversation ")
            res.json({ "data": result, "bool": true })
            res.end();
        })
    } catch (e) {
        res.json(e)
        res.end();
    }
}
exports.chat = (req, res) => {
    try {
        console.log("Chata", req.body)
        var convid = new Date();
        let senderId = req.body['senderid'];
        let receiverId = req.body['receiverid'];
        let messagE = req.body['message'];
        // {"participants":req.body['senderid'],"participants":req.body['receiverid']}
        conversation_schema.find({ "participants": { $all: [senderId, receiverId] } }).then(result => {
            console.log(result, "result")
            if (result == null || result.length <= 0) {
                console.log(result, "--------------------")
                var uniqueid = convid.getDate() + '' + convid.getMonth() + '' + convid.getFullYear() + '' + convid.getSeconds() + '' + convid.getMilliseconds()
                var conversation = new conversation_schema({
                    id: uniqueid,
                    participants: [senderId, receiverId]
                })
                conversation.save().then((saved) => {
                    var chat = new chat_schema({
                        senderid: senderId,
                        message: messagE,
                        conversationid: uniqueid
                    })
                    chat.save().then((data) => {
                        // console.log("chatentry chat if ===0 saved",data)               
                        let a = JSON.parse(data['conversationid'])
                        res.json({ "data": a, "msg": "new converstaion", "bool": true });
                        res.end();
                    })
                })
            } else {
                console.log(result[0].id, "+++++++++++++++++++")
                var chat = new chat_schema({
                    senderid: senderId,
                    message: messagE,
                    conversationid: result[0].id
                })
                chat.save().then((data) => {
                    // console.log("chatentry chat saved",data)    
                    let a = JSON.parse(data['conversationid'])
                    res.json({ "data": a, "msg": "exits", "bool": true })
                    res.end();
                })
            }
        })

    } catch (e) {
        res.json(e)
        res.end();
    }
}
exports.profile = (req, res) => {
    console.log(req.body, req.headers)
    try {
        user_schema.findOneAndUpdate({ "username": req.headers['user'] }, { $set: { "profile": req.file.filename } }).then(result => {
            res.json({ "data": result, "bool": true });
            res.end("Uploaded");
        })
    }
    catch (e) {
        res.json(e);
        res.end();
    }
}
exports.getprofile = (req, res) => {
    try { 
        let p = req.params.username;
        console.log(test+"/"+p)
        console.log(p)
        user_schema.findOne({ "username": req.params.username }).then(result => {   
            console.log("data",result)          
                mod.fs.readFile(test+"/"+result['profile'], (err, data) => {
            // mod.fs.readFile(test+"/"+p, (err, data) => {
                if (err) {
                    console.log(err)
                    res.json(err);
                    res.end();
                }
                if (data) {
                    // console.log(data,"data")
                    res.writeHead(200, { 'Content-type': 'image/jpg' });
                    res.end(data);
                }
            })            
        })
        
    } catch (e) {
        res.json(e);
        res.end();
    }
}