import { Router } from "express"
import taskController from "../controllers/taskController.js"

const taskRouter = new Router()

taskRouter.post("/add-task", taskController.addTask)
taskRouter.post("/delete-task", taskController.deleteTask)
taskRouter.post("/tasks", taskController.getTasks)
taskRouter.post("/update-task", taskController.updateTask)

export default taskRouter
