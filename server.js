// Declare variables
const express = require('express')
const app = express()
const PORT = 7300
const mongoose = require('mongoose')
const TodoTask = require('./models/Todotask')
require('dotenv').config()


// Set middleware
app.set('view engine', 'ejs')
app.use(express.static('public'))
// Helps validate what we're sending back and forth 
app.use(express.urlencoded({extended: true}))

mongoose.connect(process.env.DB_CONNECTION,
    {useNewUrlParser: true},
    () => {console.log('Connected to DB!')}
)


// Set up GET method
app.get("/", async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            res.render("index.ejs", { todoTasks: tasks });
        });
    } catch (err) {
        if (err) return res.status(500).send(err);
    }
});


// Set up POST method
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        });
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect('/')
    } catch (err) {
        if(err) return res.status(500).send(err)
        res.redirect('/')
    }
})


// Set up EDIT or UPDATE method
// Chaining (using .route, .get, .post, etc.)
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id
        TodoTask.find({}, (err, tasks) => {
            res.render('edit.ejs', {
                todoTasks:tasks, idTask: id})
            })
        })
    .post((req, res) => {
        const id = req.params.id
        TodoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },
            err => {
                if(err) return res.status(500).send(err)
                res.redirect('/')
            }
        )
    })
    

// Set up DELETE method









// Set up SERVER to LISTEN
app.listen(process.env.PORT || PORT, () => console.log(`Server is running on port ${PORT}`));