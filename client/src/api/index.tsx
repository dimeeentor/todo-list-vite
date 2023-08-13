import { Task } from "../types/Task"
import { User } from "../types/User"
import { Notification } from "../types/Notification"
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios"

class API {
    async getTasks(id: string): AxiosPromise<Pick<User, "tasks">> {
        return axios
            .post("http://localhost:3000/tasks", {
                data: { id },
            })
            .then((res: AxiosResponse) => res)
            .catch(({ response }: AxiosError<Notification>) => {
                const message = response?.data
                console.log(response)
                throw message
            })
    }

    async deleteTask(taskId: string, id: string): AxiosPromise<Notification> {
        return axios
            .post("http://localhost:3000/delete-task", {
                data: { taskId, id },
            })
            .then((res: AxiosResponse<Notification>) => res)
            .catch(({ response }: AxiosError<Notification>) => {
                const message = response?.data
                throw message
            })
    }

    async addTask(
        taskName: string,
        taskId: string,
        id: string
    ): AxiosPromise<Task> {
        return axios
            .post("http://localhost:3000/add-task", {
                data: { taskName, taskId, id },
            })
            .then((res: AxiosResponse<Task>) => res)
            .catch(({ response }: AxiosError<Notification>) => {
                const message = response?.data
                throw message
            })
    }

    async updateTask(
        newTaskName: string,
        taskId: string,
        id: string
    ): AxiosPromise<{ newTaskName: string }> {
        return axios
            .post("http://localhost:3000/update-task", {
                data: { newTaskName, taskId, id },
            })
            .then((res) => res)
            .catch(({ response }: AxiosError<Notification>) => {
                const message = response?.data
                throw message
            })
    }
}

export default new API()
