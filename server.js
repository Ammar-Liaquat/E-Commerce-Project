const dotenv = require("dotenv")
dotenv.config({quiet:true})
const express = require("express")
const connectdb = require("./config/db")
const routes = require("./routes/Index")
const app = express()
app.use(express.json())
connectdb()
app.use("/api",routes)

app.get("/",(req,res)=>{
    res.send("Welcome")
})

const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log(`Server is running on ${port} port`);    
})
