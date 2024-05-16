const express = require('express')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const cors = require('cors');
const app = express()
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: '',
    password: '',
    database: 'Smart-Brain',
  },
});

app.use(express.json())
app.use(cors())

app.get('/', (req, res)=>{
    res.json("Success!");
})

app.post('/Signin', (req, res)=>{
    if(!req.body.email|| !req.body.password) {
        return res.status(400).json("Incorrect email or password")
    }
    db.select('email', 'hash').from('login').where('email', '=', req.body.email)
    .then(data=> {
        const valid = bcrypt.compareSync(req.body.password, data[0].hash) 
        if(valid){
            return db.select('*').from('users').where('email', '=', req.body.email)
            .then(user=> {res.json(user[0])
            })
            .catch(err=>res.status(400).json('unable to find user'))
        } else {
            res.status(400).json('Wrong Credentials. Please try again')
        }
    })
    .catch(err=>res.status(400).json('Wrong Credentials'))
})


app.post('/Register', (req, res)=>{
    const { email ,name ,password } = req.body
    if(!email || !name || !password){
        return res.status(404).json('Incorrect Submission')
    }
    const hash = bcrypt.hashSync(password, saltRounds);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
            
            return trx('users')
                .returning('*')
                .insert({ 
                    email: loginEmail[0].email, 
                    name: name, 
                    joined: new Date()
                })
                .then(user=> res.json(user))
            })
            .catch(trx.rollback)
            .then(trx.commit)
        })
        .catch(err=> res.status(400).json("Unable to Register"))
})

app.get('/Profile/:id', (req, res)=>{
const { id } = req.params

db.select('*').from('users').where({id})
.then(user => {
    if(user.length) {
    
        res.json(user[0])
    
    }else{
        res.status(400).sendStatusjson("user not found")
    }
    
})
.catch(err => res.status(400).json("error getting profile"))
        })
    
        
app.put('/image', (req, res)=>{
    const { id } = req.body
db('users').where('id','=',id)
.increment('entries',1)
.returning('entries')
.then(entries=>{res.json(entries[0].entries)})
.catch(err=>res.status(400).json("No Entries were found"))
})

app.listen(3000, ()=>{
    console.log('listening on port 3000');
})

// res = this is working
// /signin --> Post = success/fail
// /register --> Post = user
// /Profile/:userid --> GET = user
// /Image --> Put --> user
