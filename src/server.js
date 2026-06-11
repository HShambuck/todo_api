import { dir } from "console";
import express from "express";
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

// Website endpoints
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)



app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
