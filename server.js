const express = require('express');
const fs= require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { runInNewContext } = require('vm');
const util = require('util');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET index.html
app.get('/',(req,res)=>
res.sendFile(path.join(__dirname,'./public/index.html'))
);

//  GET notes (notes.html)
app.get('/notes',(req,res)=>
res.sendFile(path.join(__dirname,'./public/notes.html'))
);



// GET api/notes (should read db.json)
app.get('/api/notes',(req,res)=>{
const notes = JSON.parse(fs.readFileSync(`./db/db.json`))
res.json(notes)
});

//  POST api/notes (write file?)
app.post('/api/notes',(req,res)=>{
    const newNotes = JSON.parse(fs.readFileSync(`./db/db.json`))
// If the new note has a title and a text then it will be created and given a unique ID.
    const {title, text} = req.body;
    if(req.body) {
        const newNote ={
            title,
            text,
            id: uuidv4()
        };
    //pushes the newly created note into the existing notes and responds that it has been created. 
        newNotes.push(newNote);
        const stringNotes = JSON.stringify(newNotes,null,4)
        fs.writeFileSync(`./db/db.json`,stringNotes)
        console.log(`New note ${newNote.id} has been written in JSON file`);
        res.json(`New note ${newNote.id} has been written in JSON file`);
    
    } else {
        throw err;
    }
    
})

// BONUS DELETE Method /api/notes/:id (will need to READ all notes from db.json THEN remove the note with the given id, THEN rewrite file )

app.delete('/api/notes/:id',(req,res)=>{
    const api = JSON.parse(fs.readFileSync(`./db/db.json`)) 
    fs.writeFileSync(`./db/db.json`,JSON.stringify(api.filter(filterNote=>{filterNote.id!=req.params.id}),null,4));
    res.json(`Note has been deleted`);
})

//ADD listener for app 
app.listen(PORT,()=>
console.log(`App listening at http://localhost:${PORT}`));

