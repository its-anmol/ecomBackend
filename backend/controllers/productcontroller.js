const Product=require("../models/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError=require("../middleware/catchAsuncErrors");
const ApiFeatures=require("../utils/apifeatures");

//create product--admin
exports.createProduct= catchAsyncError(async(req,res)=>{
    req.body.user=req.user.id;
    const product=await Product.create(req.body);
    res.status(201).json({
        success:true,
        product,
    })
})

//get all product
exports.getAllProduct=catchAsyncError(async(req,res)=>{

    const resultPerPage=3;
    const productCount=await Product.countDocuments();
    const apifeature=new ApiFeatures(Product.find(),req.query)
    .search()
    .filter().pagination(resultPerPage);
    const products=await apifeature.query;
    res.status(200).json({
        success:true,
        products,
        productCount
    })
})

//get product detail single

exports.getProductDetail=catchAsyncError(async(req,res,next)=>{

    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler ("product not found",404))
    }
    res.status(200).json({
        success:true,
        product,
    })
})


// update product admin

exports.updateProduct=catchAsyncError(async(req,res,next)=>{
    let product=Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found",404))
    }
    product=await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
})

// Delete product

exports.deleteProduct= catchAsyncError(async (req,res,next)=>{
    const product=Product.findById(req.params.id);
 //   console.log(!product);
    if(!product){
        return next(new ErrorHandler("product not found",404))
    }

    await product.deleteOne();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
})

// create new Review or update the review

exports.createProductReview=catchAsyncError(async(req,res,next)=>{
    const{rating,comment,productId}=req.body
    const review={
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product= await Product.findById(productId)

    const isReviewed=await product.reviews.find((rev)=>rev.user.toString()===req.user.id.toString());
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user.id.toString()){
            rev.rating=rating,
            rev.comment=comment
            }
        })
    }
    else{
        product.reviews.push(review)
    }
    product.numOfReviews=product.reviews.length;
    let avg=0
    product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
    
    product.ratings = avg / product.reviews.length;
    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true,
        message:"review added successfully"
    })
})

//GET ALL REVIEWS
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  });

  //
  
  // Delete Review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    console.log(product)
  
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() === req.query.id
    );
    console.log(reviews)
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });