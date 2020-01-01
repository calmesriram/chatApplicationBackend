let mod = require('./applibrary/localmodules');
require('custom-env').env()
express = mod.express;
var app = express();
require('./routes/routes')(app);
app.use(mod.bodyparser.json());
app.use(mod.bodyparser.urlencoded({ extended: true }));
app.use(mod.cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

mod.mongoose.connection.on('connected', function () {
    console.log('Connection to Mongo established.');
    if (mod.mongoose.connection.client.s.url.startsWith('mongodb+srv')) {
        mod.mongoose.connection.db = mod.mongoose.connection.client.db("Chat");
    }
});

mod.mongoose.connect("mongodb+srv://sriram:sriram@cluster0-htdg9.mongodb.net/", { dbName:"Chat",useUnifiedTopology: true,useNewUrlParser: true  }, function (err, client) {
    if (err) {
        console.log("mongo error", err);
        return;
    }
})



var port = process.env.PORT || 3000;
app.listen(port);
console.log("port is An Active:", port);