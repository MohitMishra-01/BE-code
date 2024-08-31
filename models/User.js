const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required:true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password:{
        type: String,
        required:true,
        minlength: 8,
        select: false,
    },
    passwordConfirm:{
        type: String,
        required:true,
        minlength: 8,
        select: false,
        validate: {
            validator: function(el){
                return el===this.password;
            },
            message: "Password is not match"
        },
    },
    isVerified: {
        type: Boolean,
        default: false,
        select: false
    },
    otp:{
        type: String,
    },
    passwordResetOTP:{
        type: String,
    },
    role:{
        type: String,
        enum: ["user","admin"],
        default: "user"
    },
    street: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    zipCode: {
        type: String,
        required: false
    },
    profileImg: {
        type: String,
        required: false
    }
},
{
    timestamps: true,
},
);

module.exports= mongoose.model("User", UserSchema);