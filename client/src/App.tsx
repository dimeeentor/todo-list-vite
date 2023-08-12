import { v4 } from "uuid"
import { Task } from "./types/Task"
import TaskElement from "./components/Task"
import styles from "./styles/App.module.css"
import axios, { AxiosRequestConfig } from "axios"
import { useState, useRef, useCallback, useEffect } from "react"
import ErrorBlock from "./components/ErrorBlock"

export type TaskProps = {
    task: Task
    doRemoveTask?: (id: string) => void
}

type ErrorBlock<T> = {
    isShowing: boolean
    error: T
}

function App() {
    const inputTaskRef = useRef<HTMLInputElement>(null)
    const [errorShow, setErrorShow] = useState<ErrorBlock<Error>>({
        isShowing: false,
        error: { message: "", name: "" },
    })
    const [allTasks, setAllTasks] = useState<Task[]>([])
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

    const doShowError = (error: Error) => {
        setErrorShow({
            isShowing: true,
            error: { message: error.message, name: error.name },
        })

        setTimeout(
            () =>
                setErrorShow({
                    isShowing: false,
                    error: { message: "", name: "" },
                }),
            2000
        )

        return <ErrorBlock error={error} />
    }

    const doAddNewTask = useCallback(async () => {
        const taskName = inputTaskRef.current!.value
        const taskId = v4()
        const addNewTaskOptions = {
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
                if (error instanceof Error) doShowError(error)
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
                        .catch((error) =>
                            error instanceof Error ? doShowError(error) : ""
                        )
                )
        } catch (error) {
            if (error instanceof Error) doShowError(error)
        }
    }, [])

    useEffect(() => {
        try {
            axios
                .get("http://localhost:3000/auth/users")
                .then(({ data }) => setAllTasks(data.users.tasks))
        } catch (error) {
            if (error instanceof Error) doShowError(error)
        }
    }, [])

    return (
        <main className={styles["todo-window"]}>
            <h1 className={styles["heading"]}>Tasks: {allTasks.length}</h1>
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

            {errorShow.isShowing ? <ErrorBlock error={errorShow.error} /> : ""}
        </main>
    )
}
export default App
