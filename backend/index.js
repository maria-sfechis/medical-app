const express = require("express");
const sql = require("msnodesqlv8");
const connectionString = require("./dbConfig");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to the API");
});

app.post("/signup", (req, resp) => {
    const { name, email, password } = req.body;
    const query = "INSERT INTO Spital.dbo.People4 (name, email, password) VALUES (?, ?, ?)";
    
    
    sql.query(connectionString, query, [name, email, password], (err) => {
        if (err) {
            console.error(err);
            resp.status(500).json({ message: "Error inserting user" });
        } else {
            resp.status(201).json({ message: "User registered successfully" });
        }
    });
   
    

});

app.post("/login", (req, resp) => {
    const { email, password } = req.body;
    const query = "SELECT * FROM Spital.dbo.People4 WHERE email = ? AND CAST(password AS NVARCHAR(MAX)) = ?";

    sql.query(connectionString, query, [email, password], (err, rows) => {
        if (err) {
            console.error(err);
            resp.status(500).json({ message: "Error logging in" });
        } else {
            if (rows.length > 0) {
                // Dacă găsim un utilizator cu această combinație de email și parolă
                // trimitem înapoi detalii despre utilizator, excludând parola
                resp.status(200).json({ user: rows[0], message: "Login successful" });
            } else {
                // Dacă nu găsim niciun utilizator cu această combinație de email și parolă
                resp.status(401).json({ message: "Invalid email or password" });
            }
        }
    });
});

app.post("/programari", (req, resp) => {
    const { data, ora, nume, prenume, telefon, serviciu, email } = req.body;
    const query = "INSERT INTO Spital.dbo.Programari (data, ora, nume, prenume, telefon, serviciu, email) VALUES (?, ?, ?, ?, ?, ?, ?)";

    sql.query(connectionString, query, [data, ora, nume, prenume, telefon, serviciu, email], (err) => {
        if (err) {
            console.error(err);
            resp.status(500).json({ message: "Error inserting appointment" });
        } else {
            resp.status(201).json({ message: "Appointment added successfully" });
        }
    });
});

app.get("/programariget", (req, res) => {
    const email = req.query.email;
    const query = `SELECT * FROM Spital.dbo.Programari WHERE Email = '${email}'`;


    sql.query(connectionString, query, (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Error fetching appointments" });
        } else {
            res.status(200).json(rows);
        }
    });
});


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
