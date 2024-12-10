import express from 'express';
import connectDB from './Database/connect.db.js';
import dotenv from 'dotenv';
import authRouter from './Routers/auth.route.js'
import cookieParser from 'cookie-parser';
import cors from "cors"
import path from "path"



const app = express();



dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();


app.use('/api/auth', authRouter);

if(process.env.NODE_ENV==="production")
{
    app.use(express.static(path.join(__dirname, "Frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname, "Frontend","dist","index.html"));
    })
}


app.listen(PORT, () => {
    connectDB();
    console.log(`Server is listening on port ${PORT}`);
})

