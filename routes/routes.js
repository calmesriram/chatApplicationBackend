var route = require('../manuplate/manuplate.js');
module.exports = (app) => {
    app.get('/', route.test);
    app.get('/listusers', route.listusers);
    app.post('/reg', route.reg);
    app.post('/userrequest', route.userrequest);
    app.post('/acceptrequest', route.acceptrequest);
    app.post('/login', route.login);
    app.post('/conversation', route.conversation);
    app.post('/conversationdet', route.conversationdet);
    app.post('/chat', route.chat);
    app.post('/profile', route.upload.single('avatar'), route.profile);
    app.get('/getprofile/:username', route.getprofile);


}