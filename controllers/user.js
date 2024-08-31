const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const { Order } = require("../models/Order");
const TemporaryUser = require("../models/temporaryUser");
require('dotenv').config();
const twilio = require('twilio');

//     apiKey: process.env.VONAGE_API_KEY,
//     apiSecret: process.env.VONAGE_API_SECRET,
// });

// const registerController = async (req, res) => {
//     try {
//         const existingUser = await User.findOne({ email: req.body.email });
//         if (existingUser) {
//             return res.status(200).send({
//                 message: "User already exists",
//                 success: false,
//             });
//         }

//         const password = req.body.password;
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(password, salt);
//         req.body.password = hashPassword;

//         const confirmPassword = await bcrypt.hash(req.body.passwordConfirm, salt);
//         req.body.passwordConfirm = confirmPassword;

//         const otp = otpGenerator.generate(6, {
//             digits: true,
//             upperCase: false,
//             specialChars: false,
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//         });

//         if (req.body.password === req.body.passwordConfirm) {
//             const newUser = new User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 passwordConfirm: req.body.passwordConfirm,
//                 otp: otp,
//             });
//             await newUser.save();

//             const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//                 expiresIn: "1d",
//             });

//             vonage.message.sendSms(
//                 "InwoodPizza", // Sender ID or phone number
//                 req.body.phone, // Recipient's phone number
//                 `Dear ${req.body.name}, your OTP for email verification is: ${otp}`, // Message content
//                 (err, responseData) => {
//                     if (err) {
//                         console.log(err);
//                         return res.status(500).send({
//                             message: "Error sending SMS",
//                             success: false,
//                         });
//                     } else {
//                         if (responseData.messages[0]['status'] === "0") {
//                             console.log("Message sent successfully.");
//                         } else {
//                             console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
//                             return res.status(500).send({
//                                 message: "Error sending SMS",
//                                 success: false,
//                             });
//                         }
//                     }
//                 }
//             );

//             return res.status(201).send({
//                 message: "Registered successfully. OTP sent to phone",
//                 success: true,
//                 data: {
//                     user: newUser,
//                     token,
//                 },
//             });
//         } else {
//             return res.status(201).send({
//                 message: "Passwords do not match",
//                 success: false,
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             message: "Registration error",
//             success: false,
//         });
//     }
// };


// const registerController = async (req, res) =>{
//     try{
//         const existingUser = await User.findOne({email: req.body.email});
//         if(existingUser){
//             return res.status(200).send({
//                 message: "User already exist",
//                 success: false,
//             })
//         }

//         const password = req.body.password
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(password, salt)
//         req.body.password = hashPassword;

//         const confrimPassword = await bcrypt.hash(req.body.passwordConfirm, salt);
//         req.body.passwordConfirm = confrimPassword

//         const otp = otpGenerator.generate(6, {
//             digits: true,
//             upperCase: false,
//             specialChars: false,
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//         });
        

//         if(req.body.password === req.body.passwordConfirm){
//             const newUser = new User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 passwordConfirm: req.body.passwordConfirm,
//                 otp: otp,
//             });
//             await newUser.save();

//             const token = jwt.sign({id : newUser._id}, process.env.JWT_SECRET, {
//                 expiresIn: "1d",
//             })
//             const transporter = nodemailer.createTransport({
//                 service: "Gmail",
//                 auth: {
//                     user: process.env.GMAIL_USERNAME,
//                     pass: process.env.GMAIL_PASS
//                 },
//             });

//             const mailOptions = {
//                 from: "Inwood Pizza Shop <no-reply@inwoodpizzashop.com>",
//                 to: req.body.email,
//                 subject: "OTP for Email Verification",
//                 text: `Dear ${req.body.name},\n\nThank you for registering at Inwood Pizza Shop.\n\nYour One-Time Password (OTP) for email verification is: ${otp}\n\nPlease use this OTP to verify your email address.\n\nBest Regards,\nInwood Pizza Shop Team`,
//             };

//             transporter.sendMail(mailOptions), (error, info) => {
//                 if (error) {
//                     console.log(error);
//                     return res.status(500).send({
//                         message: "Error sending email",
//                         success: false,
//                     });
//                 }
//             }
//             return res.status(201).send({
//                 message: "Register Successfully. OTP Sent to email",
//                 success: true,
//                 data: {
//                     user: newUser,
//                     token,
//                 },
//             });
//         }
//         else{
//             return res.status(201).send({
//                 message: "Password not Match",
//                 success: false,
//             });
//         }
//     } catch (error){
//         console.log(error);
//         return res.status(500).send({
//             message: "Register error",
//             success: false
//         });
//     }
// };

// const registerController = async (req, res) => {
//     try {
//         // Check if the email already exists
//         const existingUserByEmail = await User.findOne({ email: req.body.email });
//         if (existingUserByEmail) {
//             return res.status(200).send({
//                 message: "User with this email already exists",
//                 success: false,
//             });
//         }

//         // Check if the phone number already exists
//         const existingUserByPhone = await User.findOne({ phoneNumber: req.body.phoneNumber });
//         if (existingUserByPhone) {
//             return res.status(200).send({
//                 message: "User with this phone number already exists",
//                 success: false,
//             });
//         }

//         // Hash the password
//         const password = req.body.password;
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(password, salt);
//         req.body.password = hashPassword;

//         const confirmPassword = await bcrypt.hash(req.body.passwordConfirm, salt);
//         req.body.passwordConfirm = confirmPassword;

//         // Generate OTP
//         const otp = otpGenerator.generate(6, {
//             digits: true,
//             upperCase: false,
//             specialChars: false,
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//         });

//         if (req.body.password === req.body.passwordConfirm) {
//             // Create new user
//             const newUser = new User({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 passwordConfirm: req.body.passwordConfirm,
//                 otp: otp,
//                 phoneNumber: req.body.phoneNumber, // Storing phone number
//             });
//             await newUser.save();

//             // Generate JWT token
//             const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//                 expiresIn: "1d",
//             });

//             // Send OTP via email
//             const transporter = nodemailer.createTransport({
//                 service: "Gmail",
//                 auth: {
//                     user: process.env.GMAIL_USERNAME,
//                     pass: process.env.GMAIL_PASS,
//                 },
//             });

//             const mailOptions = {
//                 from: "Inwood Pizza Shop <no-reply@inwoodpizzashop.com>",
//                 to: req.body.email,
//                 subject: "OTP for Email Verification",
//                 text: `Dear ${req.body.name},\n\nThank you for registering at Inwood Pizza Shop.\n\nYour One-Time Password (OTP) for email verification is: ${otp}\n\nPlease use this OTP to verify your email address.\n\nBest Regards,\nInwood Pizza Shop Team`,
//             };

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.log(error);
//                     return res.status(500).send({
//                         message: "Error sending email",
//                         success: false,
//                     });
//                 }
//             });

//             // Send OTP via SMS using Twilio
//             const accountSid = process.env.TWILIO_ACCOUNT_SID;
//             const authToken = process.env.TWILIO_AUTH_TOKEN;
//             const client = twilio(accountSid, authToken);

//             try {
//                 await client.messages.create({
//                     body: `Dear ${req.body.name}, your OTP for Inwood Pizza Shop registration is: ${otp}`,
//                     from: process.env.TWILIO_PHONE_NUMBER,
//                     to: req.body.phoneNumber, // Storing phone number
//                 });
//             } catch (error) {
//                 if (error.code === 21408) {
//                     return res.status(400).send({
//                         message: "Permission to send SMS to this region is not enabled.",
//                         success: false,
//                     });
//                 } else {
//                     console.log(error);
//                     return res.status(500).send({
//                         message: "Error sending SMS",
//                         success: false,
//                     });
//                 }
//             }

//             // Successful registration response
//             return res.status(201).send({
//                 message: "Register Successfully. OTP Sent to SMS",
//                 success: true,
//                 data: {
//                     user: newUser,
//                     token,
//                 },
//             });
//         } else {
//             return res.status(400).send({
//                 message: "Password does not match",
//                 success: false,
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             message: "Register error",
//             success: false,
//         });
//     }
// };

//  use twilio in tempUser
// const registerController = async (req, res) => {
//     try {
//         const existingUserByEmail = await User.findOne({ email: req.body.email });
//         if (existingUserByEmail) {
//             return res.status(200).send({
//                 message: "User with this email already exists",
//                 success: false,
//             });
//         }

//         const existingUserByPhone = await User.findOne({ phoneNumber: req.body.phoneNumber });
//         if (existingUserByPhone) {
//             return res.status(200).send({
//                 message: "User with this phone number already exists",
//                 success: false,
//             });
//         }

//         const password = req.body.password;
//         const salt = await bcrypt.genSalt(10);
//         const hashPassword = await bcrypt.hash(password, salt);
//         req.body.password = hashPassword;

//         const confirmPassword = await bcrypt.hash(req.body.passwordConfirm, salt);
//         req.body.passwordConfirm = confirmPassword;

//         const otp = otpGenerator.generate(6, {
//             digits: true,
//             upperCase: false,
//             specialChars: false,
//             upperCaseAlphabets: false,
//             lowerCaseAlphabets: false,
//         });

//         if (req.body.password === req.body.passwordConfirm) {
//             const newTempUser = new TemporaryUser({
//                 name: req.body.name,
//                 email: req.body.email,
//                 password: req.body.password,
//                 passwordConfirm: req.body.passwordConfirm,
//                 otp: otp,
//                 phoneNumber: req.body.phoneNumber,
//             });
//             await newTempUser.save();

//             const accountSid = process.env.TWILIO_ACCOUNT_SID;
//             const authToken = process.env.TWILIO_AUTH_TOKEN;
//             const client = twilio(accountSid, authToken);

//             try {
//                 await client.messages.create({
//                     body: `Dear ${req.body.name}, your OTP for Inwood Pizza Shop registration is: ${otp}`,
//                     from: process.env.TWILIO_PHONE_NUMBER,
//                     to: req.body.phoneNumber,
//                 });
//             } catch (error) {
//                 if (error.code === 21408) {
//                     return res.status(400).send({
//                         message: "Permission to send SMS to this region is not enabled.",
//                         success: false,
//                     });
//                 } else {
//                     console.log(error);
//                     return res.status(500).send({
//                         message: "Error sending SMS",
//                         success: false,
//                     });
//                 }
//             }

//             return res.status(201).send({
//                 message: "Register Successfully. OTP Sent to SMS",
//                 success: true,
//                 token,
//             });
//         } else {
//             return res.status(400).send({
//                 message: "Password does not match",
//                 success: false,
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             message: "Register error",
//             success: false,
//         });
//     }
// };

// use twilio 
const registerController = async (req, res) => {
    try {
        // Check if the email already exists
        const existingUserByEmail = await User.findOne({ email: req.body.email });
        if (existingUserByEmail) {
            return res.status(200).send({
                message: "User with this email already exists",
                success: false,
            });
        }

        // Check if the phone number already exists
        const existingUserByPhone = await User.findOne({ phoneNumber: req.body.phoneNumber });
        if (existingUserByPhone) {
            return res.status(200).send({
                message: "User with this phone number already exists",
                success: false,
            });
        }

        // Hash the password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        req.body.password = hashPassword;

        const confirmPassword = await bcrypt.hash(req.body.passwordConfirm, salt);
        req.body.passwordConfirm = confirmPassword;

        // Generate OTP
        const otp = otpGenerator.generate(6, {
            digits: true,
            upperCase: false,
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });

        if (req.body.password === req.body.passwordConfirm) {
            // Create new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
                otp: otp,
                phoneNumber: req.body.phoneNumber, // Storing phone number
            });
            await newUser.save();

            // Generate JWT token
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            // Send OTP via SMS using Twilio
            const accountSid = process.env.TWILIO_ACCOUNT_SID;
            const authToken = process.env.TWILIO_AUTH_TOKEN;
            const client = twilio(accountSid, authToken);

            try {
                await client.messages.create({
                    body: `Dear ${req.body.name}, your OTP for Inwood Pizza Shop registration is: ${otp}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: req.body.phoneNumber, // Storing phone number
                });
            } catch (error) {
                if (error.code === 21408) {
                    return res.status(400).send({
                        message: "Permission to send SMS to this region is not enabled.",
                        success: false,
                    });
                } else {
                    console.log(error);
                    return res.status(500).send({
                        message: "Error sending SMS",
                        success: false,
                    });
                }
            }

            // Successful registration response
            return res.status(201).send({
                message: "Register Successfully. OTP Sent to SMS",
                success: true,
                data: {
                    user: newUser,
                    token,
                },
            });
        } else {
            return res.status(400).send({
                message: "Password does not match",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Register error",
            success: false,
        });
    }
};



const authController = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.body.userId});
        if(!user){
            return res.status(200).send({
                message: "user not found",
                success: false,
            })
        } else{
            console.log(user);
            return res.status(200).send({
                message: "Register Successfully",
                data: {
                    user,
                },
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Auth error",
        });
    }
};

const loginController = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).select(
            "+password"
        );
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Password",
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        return res.status(201).send({
            message: "Login Successfully",
            data: {
                user,
                token,
            },
            success: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Authentication error",
        });
    }
};

const verifyOTPController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                message: "User not found",
                success: false,
            });
        }

        if (user.otp !== otp) {
            return res.status(400).send({
                message: "Invalid OTP",
                success: false,
            });
        }

        // Clear the OTP after successful verification
        user.otp = undefined;
        user.isVerified = true;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        return res.status(200).send({
            message: "OTP verified successfully",
            success: true,
            data: {
                user,
                token,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "OTP verification error",
            success: false,
        });
    }
};



const updateUserProfile = async (req, res) => {
    try {
        const {name,profileImg,userId,zipCode,country,state,city,street,phoneNumber} = req.body;

        const user =await User.findById(userId);
        if(!user){
            return res.status(200).send({
                message: "User Not Found!",
                success: false
            });
        }

        user.name = name || user.name
        user.profileImg = profileImg || user.profileImg
        user.street = street || user.street,
        user.country = country || user.country
        user.city = city || user.city
        user.state = state || user.state
        user.zipCode = zipCode || user.zipCode
        user.phoneNumber = phoneNumber || user.phoneNumber
        
        await user.save();
        return res.status(201).send({
            success: true,
            message: "Profile Updated Succesfully",
        });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: "User error",
        });
    }
}

const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        
        const userDetails = await User.findOne({ email });

        if (!userDetails) {
            return res.status(404).json({
                error: "User not found",
                success: false
            });
        }

        res.status(200).json({
            message: "User Details",
            success: true,
            data: {
                user: userDetails 
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Internal Server Error",
            success: false,
        });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user with the provided email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP (digits only)
        const generateOtp = otpGenerator.generate(6, { digits: true, upperCase: false, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false });

        // Update user record with OTP
        user.passwordResetOTP = generateOtp;
        await user.save();

        // Send OTP to user's phone number using Twilio
        const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        const message = await client.messages.create({
            body: `Dear customer, your One-Time Password (OTP) for resetting your password at Inwood Pizza is: ${generateOtp}.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: user.phoneNumber, // Assuming you have the user's phone number stored in the user record
        });

        console.log(message.sid);

        return res.status(200).json({ message: 'OTP sent to your phone number' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if OTP matches
        if (user && user.passwordResetOTP === otp) {
            return res.status(200).json({ message: 'OTP verified successfully', userId: user._id });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const changePassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });    
         }
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserOrders = async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 }); 
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {registerController, authController, loginController, verifyOTPController, updateUserProfile,getUserByEmail, sendOtp, verifyOTP, changePassword, getUserOrders};