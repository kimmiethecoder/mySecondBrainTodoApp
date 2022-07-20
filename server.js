// Declare variables
const express = require('express');
const app = express();
const PORT = 7300;
const mongoose = require('mongoose');
require('dotenv').config();
const TodoTask = require('./models/todotask')

// Set middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Helps validate what we're sending back and forth 
app.use(express.urlencoded({extended: true}));

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log('Connected to DB!')}
)

// Set up GET method
app.get('/', async (request, response) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            response.render('index.ejs', {
                todoTasks: tasks
            })
        })
    } catch (error) {
        response.status(500).send({message: error.message})
    }
});

// Set up POST method
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        }
    )
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch (err) {
        if(err) return res.status(500).send(err)
        res.redirect('/')
    }
});








// Set up SERVER to LISTEN
app.listen(process.env.PORT || PORT, () => console.log(`Server is running on port ${PORT}`));