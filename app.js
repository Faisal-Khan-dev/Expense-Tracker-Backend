import express from 'express'
import mongoose from 'mongoose';
import UserModel from './models/schema.js';
import bcrypt from 'bcrypt'
import cors from 'cors';
import jwt from 'jsonwebtoken'
import path from 'path';
import { auth } from './middle_ware/auth.js'
import incomeRoutes from './routes/incomeRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import { upload } from './middle_ware/uploadMiddleware.js';

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']

}));
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/uploads', express.static('uploads'));


const URI = 'mongodb+srv://faisal_khan:faisalkhan12@todo-app.hftfdud.mongodb.net/?appName=Todo-App'
mongoose.connect(URI)
    .then((res) => console.log("Mongo Db connected"))
    .catch((err) => console.log('mongo db error', err.message))
    
app.post("/signup", upload.single("profileImage"), async (req, res) => {
    try {
        console.log("res", req.body);
        console.log("File uploaded:", req.file);

        const { fullName, email, password } = req.body

        if (!email || !password) {
            return res.json({
                message: "Required fields are missing!",
            })
        }

        const user = await UserModel.findOne({ email })
    
        if (user) {
            return res.json({
                message: "Email already exist!",
                staus: false
            })
        }
    
        const hashPassword = await bcrypt.hash(password, 10)

        const userObj = {
            fullName,
            email,
            password: hashPassword,
            profileImage: req.file ? `/uploads/${req.file.filename}` : null
        };

        await UserModel.create(userObj)

        res.json({
            message: "user sucessfuly sign-up",
            status: true
        })
    } catch(error) {
        res.json({
            message: error.message || "something went wrong!",
            status: false
        })
    }
   
})
    
app.post("/update-profile-picture", auth, upload.single("profileImage"), async (req, res) => {
    try {
        console.log("Updating profile picture for user:", req.user._id);

        if (!req.file) {
            return res.json({
                status: false,
                message: "No image provided"
            });
        }

        const userId = req.user._id;

        // Update user profile image in database
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                profileImage: `/uploads/${req.file.filename}`
            },
            { new: true }
        ).select("-password"); // Exclude password from response

        if (!updatedUser) {
            return res.json({
                status: false,
                message: "User not found"
            });
        }

        console.log("Profile picture updated successfully");

        res.json({
            status: true,
            message: "Profile picture updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating profile picture:", error);
        res.status(500).json({
            status: false,
            message: error.message || "Server error"
        });
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        
        if (!email || !password) {
            return res.json({
                message: "Required fields are missing",
                status: false
            })
        }

        const user = await UserModel.findOne({ email })
        
        if (!user) {
            return res.json({
                message: "Invalid email or password!",
                status: false
            })
        }

        const comparePassword = await bcrypt.compare(password, user.password)

        if (!comparePassword) {
            return res.json({
                message: "Invalid email or password!",
                status: false
            })
        }

        const _id = user._id
        console.log("id",_id);

        const token = jwt.sign({ _id }, "Batch14", {expiresIn: "24h"})
        console.log("token", token);

        res.json({
            message: "user sucessfuly Log-in",
            status: true,
            token: token,
            user_id: _id
        })
  
        } catch (error) {
            res.json({
                message: error.message || "something went wrong!",
                status: false
            })
        }
})

app.get("/userInfo", auth, async(req, res) => {
    try {
        
        const userId = req.user._id
        console.log("user", userId);

        const user = await UserModel.findById(userId).select("-password");
        

        if (!user) {
            return res.json({
                message: "User not found!",
                status: false
            })
        }
        res.json({
            message: "user logged in",
            status: true,
            user: user,
            userId: userId
            
        })


    } catch (error) {
        res.json({
            message: error.message || "something went wrong!",
            status: false
        })
    }
})



app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.listen(PORT , ()=>console.log("Server running"))