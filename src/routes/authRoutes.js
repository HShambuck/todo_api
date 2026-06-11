import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // encrypt password
  const hashedPassword = bcrypt.hashSync(password, 3);

  try {
    // insert user into database
    const insertUser = db.prepare(`
        INSERT INTO users(username, password) VALUES(?, ?)
    `);
    const result = insertUser.run(username, hashedPassword);

    // default todo for new users
    const defaultTodo = `Hello 😊 Add your first todo`;
    const insertTodo = db.prepare(`
        INSERT INTO todos(user_id, task) VALUES(?, ?)
    `);
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // create a token for authenticated user
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.post("/login", (req, res) => {
  const {username, password} = req.body
  
  try {
    const getUser = db.prepare(`
        SELECT * FROM users WHERE username = ?
    `)
    const user = getUser.get(username)
    if (!user) return res.status(404).json('<h1>User not found</h1>')

    const passwordIsValid = bcrypt.compareSync(password, user.password)
    if(!passwordIsValid) return res.status(403).json('<h1>Invalid password</h1>')

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
    res.json({ token })
  } catch (error) {
    console.log(error.message)
    res.statusCode(503)
  }
});

export default router;
