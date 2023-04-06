const mongoose =require("mongoose");
const bcrypt =require("bcrypt")
const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png"
    }
},
{
    timestamps:true
});

userSchema.methods.matchPassword=async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
};

userSchema.pre("save", async function(next){
    if(!this.isModified){
        next()
    }

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
});

const userModel=mongoose.model("User", userSchema);

module.exports=userModel;
