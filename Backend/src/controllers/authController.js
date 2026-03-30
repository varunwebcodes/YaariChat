const User = require('../models/User.model');
const sendOtpToEmail = require('../services/emailService');
const otpGenerater = require('../utils/otpGenerater');
const response = require('../utils/responseHandler');
const twilioService = require('../services/twilioService');
const generateToken = require('../utils/generateToken');
const Conversation = require('../models/Conversation.model');

//Step 1 send-otp
const sendOtp = async(req,res) =>{
    const {phoneNumber, phoneSuffix, email} = req.body;
    const otp = otpGenerater();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);
    let user;
    try{
        if(email){
            user = await User.findOne({email});

            if(!user){
                user = new User({email})
            }
            user.emailOtp = otp;
            user.emailOtpExpiry = expiry;
            await user.save();
            await sendOtpToEmail(email,otp)
            return response(res,200,'Otp send to your email',{email});
        }

        if(!phoneNumber || !phoneSuffix){
            return response(res,400,'Phone number and phone suffix are required');
        }

        const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
        user = await User.findOne({phoneNumber, phoneSuffix});
        if(!user){
            user = new User({phoneNumber , phoneSuffix})
        }

        await twilioService.sendOtpToPhoneNumber(fullPhoneNumber)
        await user.save();

        return response(res, 200 , 'Otp send Successfully', {phoneNumber});

    }catch(error){
        console.error(error);
        return response(res,500,'Internal server error');
    }
}

//step -2  verify otp
const verifyOtp = async(req,res)=>{
    const {phoneNumber, phoneSuffix, email, otp} = req.body;
    try {
        let user;
        if(email){
            user = await User.findOne({email});
            if(!user){
                return response(res,400,"User not found")
            }

            const now = new Date();
            if(!user.emailOtp || String(user.emailOtp) !== String(otp) || now > new Date(user.emailOtpExpiry)){
                return response(res,400,"Invalid or expired otp")
            };
            user.isVerified = true;
            user.emailOtp = null;
            user.emailOtpExpiry = null;
            await user.save(); 
        }else{
            if(!phoneNumber || !phoneSuffix){
                return response(res,400,'Phone number and phone suffix are required');
            }
            const fullPhoneNumber = `${phoneSuffix}${phoneNumber}`;
            user = await User.findOne({phoneNumber, phoneSuffix});
            if(!user){
                return response(res,400,"User not found");
            }
            const result = await twilioService.verifyOtp(fullPhoneNumber, otp);
            if(!result || result.status !== "approved"){
                return response(res , 400 , "Invalid Otp");
            }
            user.isVerified = true;
            await user.save();
        }
        const token = generateToken(user?._id);
        res.cookie("auth_token", token,{
            sameSite: "strict",
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365 
        });
        return response(res,200,'Otp Verified Successfully', { token , user })
    }
    catch (error) {
        console.error(error);
        return response(res, 500, 'Internal server error');
    }
};   

const updateProfile = async(req,res)=>{
    const { username,agreed,about } = req.body;
    const userId = req.user.userId;

    try{
        const user = await User.findById(userId);
        const file = req.file;
        if(file){
            const uploadResult = await uploadFileToCloudinary(file);
            console.log(uploadResult)
            user.profilePicture = uploadResult?.secure_url;
        }else if(req.body.profilePicture){
            user.profilePicture = req.body.profilePicture;
        }

        if(username) user.username = username;
        if(agreed) user.agreed = agreed;
        if(about) user.about = about;
        await user.save();

        return response(res, 200 , 'User Profile Updated Successfully',user)
    }catch(error){
        console.error(error);
        return response(res,500, 'Internal Server Error')
    }
};

const checkAuthenticated = async(req,res)=>{
    try{
        const userId = req.user?.userId;
        if(!userId){
            return response(res,404 , 'Unauthorized! Please login.')
        }
        const user = await User.findById(userId);
        if(!user){
            return response(res, 404, 'User not found');
        }

        return response(res,200, 'User retrived and allow to use whatsaap',user);
    }catch(error){
        console.error(error);
        return response(res, 500, 'Internal server error'); 
    }
}

const logout = (req,res)=>{
    try{
        res.cookie("auth_token","", {expires:new Date(0)});
        return response(res,200,'User Logout Successfully')
    }catch(error){
        console.log(error);
        return response(res, 500, 'Internal Server Error')
    }
};

const getAllUsers = async (req, res) => {
    const loggedInUser = req.user?.userId;

    if (!loggedInUser) {
        return response(res, 401, 'Unauthorized! Please login.');
    }

    try {
        const users = await User.find({ _id: { $ne: loggedInUser } })
            .select("username profilePicture lastSeen isOnline about phoneNumber phoneSuffix")
            .lean();

        const usersWithConversation = await Promise.all(
            users.map(async (singleUser) => {
                const conversation = await Conversation.findOne({
                    participants: { $all: [loggedInUser, singleUser?._id] }
                }).populate({
                    path: "lastMessage",
                    select: 'content createdAt sender receiver'
                }).lean();

                return {
                    ...singleUser,
                    conversation: conversation || null,
                };
            })
        );

        return response(res, 200, 'Users retrieved successfully', usersWithConversation);

    } catch (error) {
        console.error(error);
        return response(res, 500, 'Internal Server Error');
    }
};

module.exports = {
    sendOtp , verifyOtp , updateProfile , logout , checkAuthenticated , getAllUsers
}