"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const books_model_1 = __importDefault(require("../books/books.model"));
let app = express_1.default();
app.get("/", (req, resp) => {
    resp.send("hello express");
});
const uri = "mongodb://localhost:27017/book";
mongoose_1.default.connect(uri, (err => {
    if (err)
        console.log(err);
    else
        console.log("mongo db connected successfully");
}));
app.get("/books", (req, resp) => {
    books_model_1.default.find((err, books) => {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(books);
    });
});
app.listen(7701, () => {
    console.log("server started");
});
