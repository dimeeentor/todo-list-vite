import { Router } from "express"
import authController from "../controllers/authController.js"
import { check } from "express-validator"

const authRouter = new Router()

authRouter.post(
    "/registration",
    [
        check("username", "Username cannot be empty.").notEmpty(),
        check(
            "password",
            "Password needs to be between 4-16 characters."
        ).isLength({ min: 4, max: 16 }),
    ],
    authController.registration
)
authRouter.post("/login", authController.login)
authRouter.get("/users", authController.getUsers)

export default authRouter
