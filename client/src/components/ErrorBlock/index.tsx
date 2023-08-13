import { FC } from "react"
import styles from "./styles.module.css"

type ErrorBlock = {
    message: string
}

const ErrorBlock: FC<ErrorBlock> = ({ message }) => {
    return <div className={styles["error"]}>{message}</div>
}

export default ErrorBlock
