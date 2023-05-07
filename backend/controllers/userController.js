const catchAsyncError=require("../middleware/catchAsuncErrors");
const User=require("../models/usermodel");
const errorHandler = require("../utils/errorhandler");
const ErrorHandler = require("../utils/errorhandler");
const sendToken = require("../utils/jwtToken");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");
const bcrypt=require("bcryptjs");



//register a user

exports.registerUser=catchAsyncError(async(req,res,next)=>{
    const {name,email,password}=req.body;
    const user=await User.create({
        name,email,password,
        avatar:{
            public_id:"this is sample id",
            url:"sample url"
        }
    });

    const token=user.getJWTToken();
    res.status(201).json({
        success:true,
        user,
        token,
    })
})

//login user

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHandler("Please Enter Email & Password", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }
    const token=user.getJWTToken();

    sendToken(user,201,res);
})

//logout user
exports.logout=catchAsyncError(async (req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        hhtpOnly:true,
    });
    res.status(200).json({
        success:true,
        message:"logged out",
    })
})

//forget password

exports.forgetPassword=catchAsyncError(async (req,res,next)=>{
    console.log(req.body.email)
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new errorHandler("user not found",403))
    }

    //get password token
    const resetToken= user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});

    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message=`your rest password token :- \n\n${resetPasswordUrl} \n\n if not requested ignore this mail`

    try{
        await sendEmail({
            email:user.email,
            subject:`ecommerce password recovery`,
            message

        })
        res.status(200).json({
            success:true,
            message:`message sent to${user.email} successfully`
        })

    }catch(error){
        user.resetPasswordExpire=undefined;
        user.resetPasswordToken=undefined;
        await user.save({validateBeforeSave:false});

        return next(new errorHandler(error.message,500))
    }

})

// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    console.log(resetPasswordToken)
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  
    if (!user) {
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Password does not password", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  });

  //GET USER DETAIL
  exports.getUserDetail=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
  })

  //update User Password
  exports.updatePassword=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user.id).select("+password");
    oldPassword=req.body.oldPassword
    //console.log(user.email)
      
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid email or password", 401));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not password", 400));
      }
    user.password=req.body.newPassword;
    await user.save();
    sendToken(user,200,res)

  })

  //UPDATE PROFILE
  exports.updateProfile=catchAsyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email
    }
    // we will add cloudinary later

    const user= await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidator:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    })

  })

  //get all users admin
  exports.getAllUser=catchAsyncError(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success:true,
        users
    })
  })

  //get single user admin
  exports.getSingleUser=catchAsyncError(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new errorHandler(`user not exit with id : ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
  })

  // update user role admin
  exports.updateUserRole=catchAsyncError(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    // we will add cloudinary later

    const user= await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidator:true,
        useFindAndModify:false
    });
    if (!user) {
        return next(new ErrorHandler(`user does not exist with id ${req.params.id}`, 401));
      }

    res.status(200).json({
        success:true,
        user
    })

  })

  // delete user
  exports.deleteUser=catchAsyncError(async(req,res,next)=>{
    const user= await User.findById(req.user.id)
    //we will remove cloudianry later
    if (!user) {
        return next(new ErrorHandler(`user does not exist with id ${req.params.id}`, 401));
      }
    
    await user.remove();

    res.status(200).json({
        success:true,
        message:"user deleted successfully"
    })

  })

  