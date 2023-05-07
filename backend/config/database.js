const mongoose=require("mongoose");
mongoose.set("strictQuery", false);

const connectdatabase =()=>{
mongoose.connect(process.env.DB_URI).then((data)=>
    console.log(`mongo db connect to server ${data.connection.host}`))//.catch((err)=>{ console.log(err)})
}

module.exports=connectdatabase