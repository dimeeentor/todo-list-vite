import { Task } from "./Task"

export type User = {
    username: string
    password: string
    tasks: Task[]
}
