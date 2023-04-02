const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const app = express();
const JWT_SECRET = "86xlVV^1A2y&NZCC7Vb0&fh&I4j45GD8KT7tOXTdQ8svxLGrt#"

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/mern-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Connected to Mongo")).catch(console.error);

// AUTH

const User = require('./models/User')

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(`${email} is trying to login ..`);

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            return res.json({token: jsonwebtoken.sign({ user: email }, JWT_SECRET)})
                        } else {
                            res.json({ error: "password incorrect" })
                        }
                    });
            } else {
                console.log('User not found');
            }
        })
        .catch(err => {
            throw err;
        });
})

app.post("/registro", (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }).then(user => {
        if (user) {
            res.json({ error: "user already exists" })
        } else {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, function (err, hashedPassword) {
                const user = new User({
                    email: email,
                    password: hashedPassword
                })
                user.save();
                return res.json({token: jsonwebtoken.sign({ user: email }, JWT_SECRET)})
            })
        }
    })
})

app.get('/users', async (req, res) => {
    const users = await User.find();
    res.json(users)
})

// TODO

const Todo = require('./models/Todo')

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos)
})

app.post('/todo/new', (req, res) => {
    const todo = new Todo({
        text: req.body.text 
    })
    todo.save();
    res.json(todo);
})

app.delete('/todo/delete/:id', async (req, res) => { 
    const result = await Todo.findByIdAndDelete(req.params.id)
    res.json(result);
})

app.get('/todo/complete/:id', async (req, res) => { 
    const todo = await Todo.findById(req.params.id)
    todo.complete = !todo.complete
    todo.save();
    res.json(todo);
})

// LISTEN

app.listen(3001, () => console.log("Server started on port 3001"))