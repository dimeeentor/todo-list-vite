import api from "./api"
import { v4 } from "uuid"
import { Task } from "./types/Task"
import TaskElement from "./components/Task"
import styles from "./styles/App.module.css"
import { useNavigate } from "react-router-dom"
import ErrorBlock from "./components/ErrorBlock"
import { Notification } from "./types/Notification"
import { useState, useRef, useCallback, useEffect } from "react"

export type TaskProps = {
    task: Task
    doRemoveTask?: (id: string) => void
}

function App() {
    const inputTaskRef = useRef<HTMLInputElement>(null)
    const [errorNotication, setErrorNotification] = useState<Notification>({
        message: "",
    })
    const [allTasks, setAllTasks] = useState<Task[]>([])
    const [isInputFocused, setIsInputFocused] = useState<boolean>(false)

    const navigate = useNavigate()

    const doShowError = ({ message }: Notification) => {
        setErrorNotification({ message })
        setTimeout(() => setErrorNotification({ message: "" }), 2000)
    }

    const doAddNewTask = useCallback(async () => {
        const taskName = inputTaskRef.current!.value
        const taskId = v4()

        if (taskName.trim().length > 0) {
            inputTaskRef.current!.value = ""
            await api
                .addTask(taskName, taskId, "64d370637f22285ea15be35a")
                .then(({ data: { taskName, taskId } }) => {
                    setAllTasks([{ taskName, taskId }, ...allTasks])
                })
                .catch((error) => doShowError(error))
        }
    }, [allTasks])

    const doRemoveTask = useCallback(async (taskId: string) => {
        await api
            .deleteTask(taskId, "64d370637f22285ea15be35a")
            .then(({ data }) => doShowError(data))
            .then(() =>
                api
                    .getTasks("64d370637f22285ea15be35a")
                    .then(({ data: { tasks } }) => setAllTasks(tasks))
            )
            .catch((error) => doShowError(error))
    }, [])

    useEffect(() => {
        api.getTasks("64d370637f22285ea15be35a")
            .then(({ data: { tasks } }) => setAllTasks(tasks))
            .catch((error: Notification) => doShowError(error))
    }, [navigate])

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
            {errorNotication.message ? (
                <ErrorBlock message={errorNotication.message} />
            ) : (
                ""
            )}
        </main>
    )
}
export default App
