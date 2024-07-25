const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Ota = require('./models/Ota');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wewg345werjktjwertkj';

app.use(cors({credential:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());

//connecting mto mongosDB
mongoose.connect('mongodb://localhost:27017/');

//regsiter
app.post('/register', async (req, res) => {
    const {username, password} = req.body;
    try{
    const userDoc = await User.create({
       username, 
       password:bcrypt.hashSync(password, salt), 
    });
    res.json(userDoc);
}catch(e){
    res.status(400).json(e)
}
});

//login
app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk){
        // logged in
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id:userDoc._id,
                username, 
            });
        });
    } else {
        res.status(400).json('Wrong credentials');
    }
})

//profile user
app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info);
    });
});


app.listen(4000);