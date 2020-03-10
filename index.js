const jwt = require('jsonwebtoken');
const _ = require('lodash');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');


app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/moshi')
    .then(()=>console.log('connected to mongodb'))
    .catch(err=>console.error('could not connect to mongodb',err));

const userSchema = new mongoose.Schema({
    name : String,
    email:String,
    password:String,    
})

const User = mongoose.model('User',userSchema);

const users = [
    {"id":0.35215578817278814,"name":"job5","password":"123dfg","email":"krish@g.com"},
    {"id":0,"name":"job5","password":"123fg","email":"krish@h.com"},
    {"id":1,"name":"job5","password":"123dg","email":"krish@i.com"}
];



app.get('/users',(req,res)=>{
    res.send(users)
})

app.get('/users/profile/:id',(req,res)=>{
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(!user){
        res.status(404).send('no user found with the id')
    }
    res.send(user)
});

app.put('/users/update/:id',(req,res)=>{
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(!user){
        res.status(404).send('no user found with the id')
    }
    user.name = req.body.name;
    res.send(user)
});

app.delete('/users/delete/:id',(req,res)=>{
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(!user){
        res.status(404).send('no user found with the id')
    }
    const index = users.indexOf(user);
    users.splice(index,1);
    res.send(user);
})

app.post('/users/register',async (req,res)=>{
    const user = new User({
        name:req.body.name,
        password:req.body.password,
        email:req.body.email
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    await user.save();
    res.send(_.pick(user,['name','email']))
})

app.post('/users/login',async(req,res)=>{
    let user = await User.findOne({email:req.body.email});
    if(!user){
        res.status(400).send('Invalid email or password')
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    console.log(validPassword);
    if(!validPassword){
        res.status(400).send('Invalid email or password');
    }
    const token = jwt.sign({_id:user._id},'jwtPrivateKey');
    res.send(token)
})




// schema starts



async function createUser(){
    const user = new User({
        name :"Charan",
        email:"a@g.com",
        password:"qweqeqe"
    });
    const result = await user.save();
    console.log(result);
    
}
//createUser();
// schema ends
app.listen(3000,()=>console.log('listening on port 3000'));
