const { name } = require("ejs");
const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const port = 8888;
const { v4: uuidv4 } = require('uuid');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'card_library',
    password: "0425"
});


app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });



let cards = [];

app.get("/", (req, res) => {
    let q = "SELECT COUNT(*) FROM cards";

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            // console.log(result[0]["COUNT(*)"]);
            let count = result[0]["COUNT(*)"];
            res.render("home.ejs", {count});
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in DB");
    }
});


app.get("/quotes", (req, res) => {
    let q = "SELECT * FROM cards";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.render("index.ejs", {result});
        })
    } catch (err) {
        res.send("Some error in DB");
    }
});

app.get("/quotes/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/quotes", upload.single("image"), (req, res) => {
    // console.log(req.body, req.file);

     // The uploaded image is available in req.file
    const imagePath = `/uploads/${req.file.filename}`;
    let card = {
        id: uuidv4(),
        image: imagePath,
        name: req.body.name,
        quote: req.body.quote,
    }

    let q = `INSERT INTO cards (id, image, name, quote) VALUES ('${card.id}', '${card.image}', '${card.name}', '${card.quote}')`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.redirect("/quotes");
        });
    } catch (err) {
        res.send("Some err in DB");
    }
});

app.get("/quotes/:id/edit", (req, res) => {
    let {id} = req.params;
    let q = `SELECT * FROM cards WHERE id='${id}'`;
    connection.query(q, (err, result) => {
        if (err) throw err;
        let card = result[0];
        res.render("edit.ejs", {card});
    });
});

app.patch("/quotes/:id", (req, res) => {
    let {id} = req.params;
    let newQuote = req.body.quote;
    let q = `UPDATE cards SET quote='${newQuote}' WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            res.redirect("/quotes");

        });
    } catch (err) {
        res.send("Some error in DB");
    } 
});

app.delete("/quotes/:id", (req, res) => {
    let {id} = req.params;
    let q = `DELETE FROM cards WHERE id='${id}'`;
    try {
        connection.query(q, (err, result) => {
            res.redirect("/quotes");
        });
    } catch (err) {
        res.send("Some err in DB");
    }
});


app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`);
});