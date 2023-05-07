
const app=require("./app.js");
const connectdatabase=require("./config/database.js")

//handling uncaught error
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise Rejection`);
    process.exit(1);
})


//config
const dotenv=require("dotenv");
dotenv.config({path:__dirname + "/config/config.env"})

//connecting database

connectdatabase();

const server=app.listen(process.env.PORT,()=>{
    console.log(`server is running on port http://localhost:${process.env.PORT}`);
})


// unhandled promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`error: ${err.message}`);
    console.log(`shutting down the server due to unhandeled promise rejection`);
    server.close(()=>{
        process.exit(1);
    });
})