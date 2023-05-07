const { json } = require("body-parser");

class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword=this.queryStr.keyword ? {
            name:{
                $regex:this.queryStr.keyword,
                $options:'i',
            },
        } :{};
        this.query=this.query.find({...keyword});
        return this;
    }

    filter(){
        const querycopy={...this.querystr}
        // removing some field for catgory
        const removeFields=["keyword","page","limit"];

        removeFields.forEach((key)=>delete querycopy[key]);

        //console.log(querycopy);

        // Filter  the price acc to pprice and rating
        let queryStr=JSON.stringify(querycopy);
        queryStr=queryStr.replace(/\b(gt|gte|lt|lte)\b/g,key=>`${key}`);
       // console.log(queryStr);

        this.query=this.query.find(JSON.parse(queryStr))
        return this;

    }
    
    pagination(resultPerPage){
        const currentPage=Number(this.queryStr.page)||1;
        const skip=resultPerPage*(currentPage-1);
        this.query=this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports=ApiFeatures;