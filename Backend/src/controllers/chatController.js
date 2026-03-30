const Conversation = require("../models/Conversation.model");
const { uploadFileToCloudinary } = require('../db/cloudinary.db')
const response = require('../utils/responseHandler')
const Message = require("../models/Message.model")

exports.sendMessage = async(req,res)=>{
    try{
        const {userId, receiverId , content , messageStatus} = req.body;
        const file = req.file;

        const participants = [senderId, receiverId].sort();
        //check if conversation already exists
        let conversation = await Conversation.findOne({
            participants: participants
        });

        if(!conversation){
            conversation = new Conversation({
                participants
            });
            await conversation.save();
        }

        let mediaUrl = null;
        let contentType = null;

        //handel file upload
        if(file){
            const uploadFile = await uploadFileToCloudinary(file);

            if(!uploadFile?.secure_url){
                return response(res, 400 , 'Failed to Upload media');
            }

            mediaUrl = uploadFile?.secure_url;

            if(file.mimetype.startWith('image')){
                contentType = 'image'
            }else if(file.mimetype.startWith('video')){
                contentType = 'video'
            }else{
                return response(res,400,"Unsupported file type")
            }
        }else if(content?.trim()){
            contentType = "text";
        }else{
            return response(res,400,"Message Content is required");
        }

        const message = new Message({
            conversation:conversation?._id,
            sender:sender_id,
            receiver:receiverId,
            content,
            contentType,
            mediaUrl,
            messageStatus
        });
        
        await message.save();
        if(message?.contentType){
            conversation.lastMessage = message?.id
        }
        conversation.unreadCount+=1;
        await conversation.save();

        const populateMessage = await Message.findOne(message?._id)
        .populate("sender","username profilePicture")
        .populate("receiver","username profilePicture") 


        return response(res, 201 , "Message send successfully", populateMessage);
    }catch(error){
        console.log(error);
        return response(res,500,"Internal server error");
    }
}


