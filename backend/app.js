
const express=require("express");
const app=express();
const cookieParser=require("cookie-parser")
const errorMidleware=require("./middleware/error")

app.use(express.json());
app.use(cookieParser());


// Route import 
const product=require("./routes/productRoute")
app.use("/api/v1",product);

const user=require("./routes/userRoute");
app.use("/api/v1",user)

const order=require("./routes/OrderRoute")
app.use("/api/v1",order);

app.use(errorMidleware);

module.exports=app;
