import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import {login, register} from "./controllers/auth.js";

import userRouter from "./routes/users.js"
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import postRouter from "./routes/posts.js";
import { posts, users } from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/post.js";



/* configurations */
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
dotenv.config()
const app=express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"))
app.use(bodyParser.json({limit:'30mb',extended:true}))
app.use(cors())
app.use("/assets",express.static(path.join(__dirname,'public/assets')))

/* file storage */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  })

const upload=multer({storage})

/* Routes with files */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts",verifyToken,upload.single("picture",createPost))
app.post("/auth/login",login)

app.use("/users",userRouter)
app.use("/posts",postRouter)

/* mongoose setup*/
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
