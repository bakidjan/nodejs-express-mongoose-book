"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const books_model_1 = __importDefault(require("./books/books.model"));
const body_parser_1 = __importDefault(require("body-parser"));
let app = express_1.default();
app.get("/", (req, resp) => {
    resp.send("hello express");
});
const uri = "mongodb://localhost:27017/book";
mongoose_1.default.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err => {
    if (err)
        console.log(err);
    else
        console.log("mongo db connected successfully");
})).then(r => {
    console.log("good ! ");
});
app.use(body_parser_1.default.json());
app.get("/books", (req, resp) => {
    books_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.get("/books/:id", (req, resp) => {
    books_model_1.default.findById(req.params.id, (err, book) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    });
});
app.put("/books/:id", (req, resp) => {
    books_model_1.default.findByIdAndUpdate(req.params.id, req.body, (err) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("update successfully");
    });
});
app.delete("/books/:id", (req, resp) => {
    books_model_1.default.findByIdAndDelete(req.params.id, req.body, (err) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("delete successfully");
    });
});
app.post("/books", (req, resp) => {
    let book = new books_model_1.default(req.body);
    book.save(err => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(book);
    }).then(r => {
        console.log("good ! ");
    });
});
app.listen(7777, () => {
    /*npm run dev for run server with npx and nodemon*/
    console.log("server started");
});
/*localhost:7777/paginateBooks?page=p&size=s
* if not page or size in parameters,
* default p = 1 and size = 5*/
app.get("/paginateBooks", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let s = parseInt(req.query.size || 5);
    books_model_1.default.paginate({}, { page: p, limit: s }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    });
});
/*localhost:7777/paginateBooks?keyword=page=p&size=s
* if not page or size in parameters,
* default p = 1 and size = 5*/
app.get("/searchBooks", (req, resp) => {
    let p = parseInt(req.query.page || 1);
    let s = parseInt(req.query.size || 5);
    let keyword = req.query.kw || "";
    books_model_1.default.paginate({ title: { $regex: ".*(?i)" + keyword + ".*" } }, { page: p, limit: s }, function (err, result) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(result);
    }).then(r => {
        console.log("good ! ");
    });
});
