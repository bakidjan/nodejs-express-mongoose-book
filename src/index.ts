import express from "express";
import mongoose from "mongoose"
import Book from "./books/books.model";
import bodyParser from "body-parser";

let app = express();
app.get("/", (req, resp) => {
    resp.send("hello express")
});

const uri = "mongodb://localhost:27017/book";
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err => {
    if (err) console.log(err);
    else console.log("mongo db connected successfully")
})).then(r => {
    console.log("good ! ")
});

app.use(bodyParser.json());

app.get("/books", (req, resp) => {
    Book.find((err, books) => {
        if (err) resp.status(500).send(err);
        else resp.send(books);
    })
});

app.get("/books/:id", (req, resp) => {
    Book.findById(req.params.id, (err, book) => {
        if (err) resp.status(500).send(err);
        else resp.send(book);
    })
});

app.put("/books/:id", (req, resp) => {
    Book.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err) resp.status(500).send(err);
        else resp.send("update successfully");
    })
});

app.delete("/books/:id", (req, resp) => {
    Book.findByIdAndDelete(req.params.id, req.body, (err) => {
        if (err) resp.status(500).send(err);
        else resp.send("delete successfully");
    })
});

app.post("/books", (req, resp) => {
    let book = new Book(req.body);
    book.save(err => {
        if (err) resp.status(500).send(err);
        else resp.send(book);
    }).then(r =>{
        console.log("good ! ")
    });
});

app.listen(7777, () => {
    /*npm run dev for run server with npx and nodemon*/
    console.log("server started")
});

/*localhost:7777/paginateBooks?page=p&size=s
* if not page or size in parameters,
* default p = 1 and size = 5*/
app.get("/paginateBooks", (req, resp) => {
    let p: Number = parseInt(req.query.page || 1);
    let s: Number = parseInt(req.query.size || 5);
    Book.paginate({}, {page: p, limit: s}, function (err, result) {
        if (err) resp.status(500).send(err);
        else resp.send(result);
    })
});

/*localhost:7777/paginateBooks?keyword=page=p&size=s
* if not page or size in parameters,
* default p = 1 and size = 5*/
app.get("/searchBooks", (req, resp) => {
    let p: Number = parseInt(req.query.page || 1);
    let s: Number = parseInt(req.query.size || 5);
    let keyword: String = req.query.kw || "";
    Book.paginate({title: {$regex: ".*(?i)" + keyword + ".*"}}, {page: p, limit: s}, function (err, result) {
        if (err) resp.status(500).send(err);
        else resp.send(result);
    }).then(r =>{
        console.log("good ! ")
    })
});
