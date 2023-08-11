import { Schema, model } from "mongoose"

const Task = new Schema({
    taskName: { type: String, required: true },
    taskId: { type: String, required: true },
})

export default model("Task", Task)
