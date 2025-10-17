import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
   res.status(201).send({msg : "Hello, World!"});
});


app.get("/api/users", (req, res)=>{
    res.send([
        { id:1, userName: "John Doe1", displayname: "Arson1"},
        { id:2, userName: "John Doe2", displayname: "Arson2"},
        { id:3, userName: "John Doe3", displayname: "Arson3"},
    ]);
    
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})