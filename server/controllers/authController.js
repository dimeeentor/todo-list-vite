import User from "../models/User.js"
import bcryptjs from "bcryptjs"
import { validationResult } from "express-validator"
import jwt from "jsonwebtoken"

const { sign } = jwt
const generateAcessToken = (id) => {
    const payload = { id }

    return sign(payload, process.env.SECRET_KEY, { expiresIn: "24h" })
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty())
                return res
                    .status(400)
                    .json({ message: "Error in registration.", errors })

            const { username, password } = req.body
            const candidate = await User.findOne({ username })
            if (candidate) {
                return res.status(400).json({ message: "User already exists." })
            }

            const hashedPassword = bcryptjs.hashSync(password, 5)
            const user = new User({ username, password: hashedPassword })
            await user.save()
            return res
                .status(200)
                .json({ message: "User successfully created." })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: "Registration error" })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `User: "${username}", does not exists.` })
            }

            const isValidPassword = bcryptjs.compareSync(
                password,
                user.password
            )
            if (!isValidPassword) {
                return res
                    .status(400)
                    .json({ message: `Password is incorrect.` })
            }

            const token = generateAcessToken(user._id)
            return res.json({ token })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: "Login error" })
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.findOne()
            return res.json({ users })
        } catch (error) {
            console.log(error)
        }
    }
}

export default new authController()
