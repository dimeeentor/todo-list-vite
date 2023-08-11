import User from "../models/User.js"

class TaskController {
    async addTask(req, res) {
        try {
            const { taskName, taskId, id } = req.body.data
            const updatedUser = await User.findByIdAndUpdate(
                id,
                {
                    $push: {
                        tasks: { $each: [{ taskName, taskId }], $position: 0 },
                    },
                },
                { new: true }
            )

            return updatedUser
                ? res.status(200).json({ taskName, taskId })
                : res.status(404).json({ message: "User not found" })
        } catch (error) {
            console.log(error)
        }
    }

    async deleteTask(req, res) {
        try {
            const { taskId, id } = req.body.data
            const updatedUser = await User.findByIdAndUpdate(id, {
                $pull: { tasks: { taskId } },
            })

            return updatedUser
                ? res.status(200).json({ message: "Task deleted." })
                : res.status(404).json({ message: "Task does not exist." })
        } catch (error) {
            console.log(error)
        }
    }

    async updateTask(req, res) {
        try {
            const { newTaskName, taskId, id } = req.body.data
            const updatedUser = await User.updateOne(
                { _id: id, "tasks.taskId": taskId },
                { $set: { "tasks.$.taskName": newTaskName } }
            )

            return updatedUser
                ? res.status(200).json({ message: "Task edited.", newTaskName })
                : res.status(404).json({ message: "Task does not exist." })
        } catch (error) {
            console.log(error)
        }
    }

    async getTasks(req, res) {
        try {
            const { id } = req.body.data
            const user = await User.findById(id)

            if (!user) {
                return res.status(400).json({ message: "User not found." })
            }

            return res.status(200).json({ tasks: user.tasks })
        } catch (error) {
            console.log(error)
        }
    }
}

export default new TaskController()
