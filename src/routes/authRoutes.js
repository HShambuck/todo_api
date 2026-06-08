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
    const defaultTodo = `Add your first todo to your todo list`;
    const insertTodo = db.prepare(`
        INSERT INTO todos(user_id, task) VALUES(?, ?)
    `);
    insertTodo.run(result.lastInsertRowid, defaultTodo);

    // create a token for authenticated user
    const token = jwt.sign(
      { id: result.lastInsertRowid },
      process.env.JWT_SECRET,
      { expiresIn: "24" },
    );

    res.json({ token });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(503);
  }
});

router.post("/login", (req, res) => {});

export default router;
