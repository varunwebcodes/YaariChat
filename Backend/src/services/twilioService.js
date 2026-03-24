const twilio = require('twilio');
const { PhoneNumberContextImpl } = require('twilio/lib/rest/lookups/v2/phoneNumber');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);


const sendOtpToPhoneNumber = async(PhoneNumber)=>{
    try{
        console.log('sending otp to this number',PhoneNumber);
        if(!PhoneNumber){
           to: throw new Error('phone Number is required');
        }
        const response = await client.verify.v2.services(serviceSid).verifications.create({
            to: PhoneNumber,
            channel:   `sms`
        })
    }catch(error){
        console.error(error);
        throw new Error("Failed to send otp")
    }
}


const verifyOtp = async(PhoneNumber,otp)=>{
    try{       
        console.log('this is my otp', otp)
        console.log('to this number',PhoneNumber);
        const response = await client.verify.v2.services(serviceSid).verificationChecks.create({
            to : PhoneNumber,
            code : otp,
        })  
        console.log('this is my otp response',response);
        return response;
    }catch(error){
        console.error(error);
        throw new Error("otp verification failed")
    }
};

module.exports = {
    sendOtpToPhoneNumber,
    verifyOtp
}