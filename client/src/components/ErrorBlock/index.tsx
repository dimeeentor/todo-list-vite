import { FC } from "react"
import styles from "./styles.module.css"

type ErrorBlockProps = {
    error: Error
}

const ErrorBlock: FC<ErrorBlockProps> = ({ error }) => {
    switch (error.message) {
        case "Network Error":
            error.message = "Cannot connect to the server."
            break
        default:
            return error.message
    }

    return <div className={styles["error"]}>{error.message}</div>
}

export default ErrorBlock
