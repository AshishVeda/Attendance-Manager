var mongoose=require("mongoose");
var subSchema=new mongoose.Schema({
    student:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        name:String
    },
    subject:String,
    percent:Number,
    attended:Number,
    total:Number
});
module.exports=mongoose.model("Subject",subSchema);