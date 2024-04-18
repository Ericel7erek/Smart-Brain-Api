const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const app = express()
app.use(express.json())
app.use(cors())
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@example.com',
            password: 'cookies',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '124',
            name: 'Sally',
            email: 'Sally@example.com',
            password: 'Bananas',
            entries: 0,
            joined: new Date(),
        }
        
    ]
}

app.get('/', (req, res)=>{
    res.send(database.users)
})

app.post('/Signin', (req, res)=>{
// bcrypt.compare('cola', '$2b$10$OuYbxemrPAadNVk1kKWbOOdc2FRvSrAnB/2Pdf8PJMVBwQJzshz.e', function(err, res) {
//     console.log('first', res);
// });
// bcrypt.compare('pass', '$2b$10$OuYbxemrPAadNVk1kKWbOOdc2FRvSrAnB/2Pdf8PJMVBwQJzshz.e', function(err, res) {
//     console.log('second', res);
// });
if (req.body.email === database.users[1].email && req.body.password === database.users[1].password){
        res.json(database.users[0]);
    } else {
        res.status(404).json('fakes')
    }
})

app.post('/Register', (req, res)=>{
    const { id,email ,name ,password } = req.body
bcrypt.hash(password, saltRounds, function(err, hash) {
    console.log(hash);
    // Store hash in your password DB.
});

    database.users.push({
            id: id,
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date(),
    })
    res.json(database.users[database.users.length-1])
})

app.get('/Profile/:id', (req, res)=>{
const { id } = req.params
let found = false
database.users.forEach(user=> {
        if(user.id === id){
            found = true
            return res.json(user)
        } 
    })
    if(!found){
            res.status(404).json('no such user')
        }
})

app.put('/image', (req, res)=>{
    const { id } = req.body
let found = false
database.users.forEach(user=> {
        if(user.id === id){
            found = true
            user.entries++
            return res.json(user.entries)
        } 
    })
        if(!found){
            res.status(404).json('no such user')
        }
})

app.listen(3000, ()=>{
    console.log('listening on port 3000');
})

// res = this is working
// /signin --> Post = success/fail
// /register --> Post = user
// /Profile/:userid --> GET = user
// /Image --> Put --> user
