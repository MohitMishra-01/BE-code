const mongoose = require('mongoose');

const TemporaryUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords do not match",
        },
    },
    otp: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now, expires: '1m' }, 
}, {
    timestamps: true,
});

module.exports = mongoose.model('TemporaryUser', TemporaryUserSchema);
