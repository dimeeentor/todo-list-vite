import axios from "axios"
import { TaskProps } from "../../App"
import styles from "../../styles/App.module.css"
import { FC, KeyboardEvent, useCallback, useRef, useState } from "react"

const TaskElement: FC<TaskProps> = ({
    task: { taskId, taskName },
    doRemoveTask,
}) => {
    const [isTaskEditing, setIsTaskEditing] = useState(false)
    const taskNameRef = useRef<HTMLParagraphElement>(null)
    const inputEditRef = useRef<HTMLInputElement>(null)

    const doEditTask = useCallback(
        async (taskId: string, newTaskName: string) => {
            setIsTaskEditing(!isTaskEditing)
            const inputEdit = inputEditRef.current!
            const task = taskNameRef.current!

            if (isTaskEditing && inputEdit.value !== "") {
                const updateTaskOptions = {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: {
                        newTaskName,
                        taskId,
                        id: "64d370637f22285ea15be35a",
                    },
                }

                try {
                    const { data } = await axios.post(
                        "http://localhost:3000/update-task",
                        updateTaskOptions
                    )

                    task.textContent = data.newTaskName as string
                    inputEdit.value = ""
                    inputEdit.placeholder = task.textContent
                } catch (error) {
                    console.log(error)
                }
            }
        },
        [isTaskEditing]
    )

    const onKeyUp = useCallback(
        (e: KeyboardEvent) =>
            e.code === "Enter"
                ? doEditTask(taskId, inputEditRef.current!.value)
                : "",
        [doEditTask, taskId]
    )

    return (
        <div className={`${styles.task} ${taskId}`}>
            <input
                className={`${styles["input-edit"]} ${
                    !isTaskEditing ? styles.hidden : ""
                }`}
                onKeyUp={onKeyUp}
                ref={inputEditRef}
                placeholder={taskName}
            />
            <p
                className={`${isTaskEditing ? styles.hidden : ""}`}
                ref={taskNameRef}
            >
                {taskName}
            </p>
            <div className={styles["task-control"]}>
                <button
                    className={`${styles["edit-btn"]}`}
                    onClick={() =>
                        doEditTask(taskId, inputEditRef.current!.value)
                    }
                >
                    {isTaskEditing ? "Done" : "Edit"}
                </button>
                <button
                    className={styles["removeTask-btn"]}
                    onClick={() => doRemoveTask?.(taskId)}
                ></button>
            </div>
        </div>
    )
}

export default TaskElement
