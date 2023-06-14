//Get into the folder
//type nodemon index.js
//it starts running on localhost/3000
//For this easy project we used nodejs, javascript, html, express, ejs.

const express = require("express");
const app = express();
const path = require("node:path");
const subredditData=require('./data.json');
const {v4:uuid}=require('uuid');
const methodOverride=require('method-override');//FOR PATCH AND DELETE REQUESTS

app.use(methodOverride('_method'))
//Request body parser with url eocnding
app.use(express.urlencoded({extended:true}))

var comments=[
    {
    id:uuid(),
    name:"Tomas", 
    comment:"This is funny Tomas"
    },
    {
    id:uuid(),
    name:"Jorge", 
    comment:"This is funny Jorge"
    },
    {
    id:uuid(),
    name:"Pedro", 
    comment:"This is funny Pedro"
    }
]

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});


app.get('/comments', (req, res)=>{
    res.render('comments/index.ejs', {comments:comments})
});
app.get('/comments/new', (req, res)=>{
    res.render('comments/new.ejs')
});
app.post('/comments', (req, res)=>{
    console.log(req.body);
    const {name, comment}=req.body;
    comments.push({id:uuid(),name, comment});
    //console.log(comments)
    res.redirect('/comments');
});
app.get('/comments/:id', (req, res)=>{
    const {id}=req.params;
    const comment=comments.find(c=>c.id===id);
    //console.log(comments)
    //console.log(comment)
    res.render('comments/show.ejs', {comment});
});
app.get('/comments/:id/edit', (req, res)=>{
    const {id}=req.params;
    const comment=comments.find(c=>c.id===id);
    console.log("comment:",comment)
    res.render('comments/edit.ejs', {comment});
});
app.patch('/comments/:id', (req, res)=>{
    const {id}=req.params;
    const comment=comments.find(c=>c.id===id);
    const newComment=req.body.comment;
    comment.comment=newComment;
    res.redirect('/comments/');
});

app.delete('/comments/:id', (req, res)=>{
    const {id}=req.params;
    comments=comments.filter(c=>c.id !==id);//to remove the element fomr the array
    res.redirect('/comments/');
});



//ANY SUBSECTION REQUESTED WILL CHANGE THE "subreddit" variable
app.get('/:subreddit', (req, res)=>{
    const {subreddit}=req.params;//get the actual variable of the request on the subsection
    const data=subredditData[subreddit];//get the data of only that section
    if(data){
        res.render('subreddit.ejs', {...data} )//send the data to the ejs
    }else{
        res.render('notFound.ejs', {subreddit:subreddit})
    }
})

app.get('/rand', (req, res)=>{
    const random = randomNumber=Math.floor(Math.random()*10)+1
    res.render('random.ejs', {random:random})
})

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
