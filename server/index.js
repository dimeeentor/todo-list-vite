import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import authRouter from "./routers/authRouter.js"
import taskRouter from "./routers/taskRouter.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 5500
const db = process.env.DB

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    })
)
app.use(express.json())

app.use("/auth", authRouter)
app.use(taskRouter)

const start = async () => {
    try {
        await mongoose.connect(db)
        app.listen(port, () => {
            console.log(
                `⚡️[server]: Server is running at http://localhost:${port}`
            )
        })
    } catch (error) {
        console.log(error)
    }
}

start()
