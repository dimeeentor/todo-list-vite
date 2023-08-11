import { v4 } from "uuid"
import { Task } from "./types/task"
import TaskElement from "./components/Task"
import styles from "./styles/App.module.css"
import axios, { AxiosRequestConfig } from "axios"
import { useState, useRef, useCallback, useEffect } from "react"

export type TaskProps = {
    task: Task
    doRemoveTask?: (id: string) => void
}

function App() {
    const inputTaskRef = useRef<HTMLInputElement>(null)
    const [allTasks, setAllTasks] = useState<Task[]>([])
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

    const doAddNewTask = useCallback(async () => {
        const taskName = inputTaskRef.current!.value
        const taskId = v4()
        const addNewTaskOptions = {
            headers: { "Content-Type": "application/json" },
            data: {
                taskName,
                taskId,
                id: "64d370637f22285ea15be35a",
            },
        }

        if (taskName.trim().length > 0) {
            inputTaskRef.current!.value = ""
            try {
                await axios
                    .post("http://localhost:3000/add-task", addNewTaskOptions)
                    .then(({ data: { taskName, taskId } }) =>
                        setAllTasks([{ taskName, taskId }, ...allTasks])
                    )
            } catch (error) {
                console.log(error)
            }
        }
    }, [allTasks])

    const doRemoveTask = useCallback(async (taskId: string) => {
        const deleteTaskOptions: AxiosRequestConfig = {
            headers: { "Content-Type": "application/json" },
            data: {
                taskId,
                id: "64d370637f22285ea15be35a",
            },
        }

        const getTasksOptions: AxiosRequestConfig = {
            headers: { "Content-Type": "application/json" },
            data: {
                id: "64d370637f22285ea15be35a",
            },
        }

        try {
            await axios
                .post("http://localhost:3000/delete-task", deleteTaskOptions)
                .then(() =>
                    axios
                        .post("http://localhost:3000/tasks", getTasksOptions)
                        .then((res) => setAllTasks(res.data.tasks))
                        .catch((e) => console.log(e))
                )
        } catch (error) {
            console.log(error)
        }
    }, [])

    useEffect(() => {
        axios
            .get("http://localhost:3000/auth/users")
            .then((res) => setAllTasks(res.data.users.tasks))
            .catch((e) => console.log(e))
    }, [])

    return (
        <main className={styles["todo-window"]}>
            <h1>Tasks: {allTasks.length}</h1>
            <div className={styles["input-section"]}>
                <input
                    className={styles["input-task"]}
                    placeholder="Enter your task..."
                    onKeyUp={(e) => (e.code === "Enter" ? doAddNewTask() : "")}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    ref={inputTaskRef}
                />
                <button
                    className={styles["done-btn"]}
                    onClick={doAddNewTask}
                    style={{
                        opacity: isInputFocused ? 1 : 0,
                        transitionDelay: ".2s",
                    }}
                >
                    Done
                </button>
            </div>
            <div className={styles.tasks}>
                {allTasks.map(({ taskId, taskName }) => (
                    <TaskElement
                        key={taskId}
                        task={{ taskId, taskName }}
                        doRemoveTask={() => doRemoveTask(taskId)}
                    />
                ))}
            </div>
        </main>
    )
}
export default App