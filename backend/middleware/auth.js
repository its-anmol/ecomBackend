const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError=require("../middleware/catchAsuncErrors");
const jwt=require("jsonwebtoken");
const user = require("../models/usermodel");

exports.isAuthenicatedUser=catchAsyncError(async(req,res,next)=>{
    const {token}=req.cookies;
    //console.log(token)
    if(!token){
        return next(new ErrorHandler("please login to access the site",401))
    }

    const decodeData=jwt.verify(token,process.env.JWT_SECRET);
    
    req.user=await user.findById(decodeData.id)

    next();


})


exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resouce `,403 )
        );
      }
      next();
    };
  }