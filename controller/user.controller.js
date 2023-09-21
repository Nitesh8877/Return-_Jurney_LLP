const mongoose=require('mongoose')
const twilio=require("twilio");
const twilioClient = twilio('ACa8b40b17beda72a147989f83745bcfee', '7fd2a7b9851d1e077b75f0d8a4e2b377');
const {map,details}=require("../utils");
exports.sendOtp=async(req,res)=>{
       try {
       
          const otp = Math.floor(100000 + Math.random() * 900000);
          let mobile=req.body.mobile;
        if(!mobile){
            return res.status(400).send({
                message:"Please enter the mobile number"
            })
        }
      

        twilioClient.messages.create({
            body:`Your OTP is: ${otp}`,
            from:"+12563735902",
            to:`+91${mobile}`
        })
        .then(() => {
          map.set(mobile,otp)
            res.status(200).send({ message: 'OTP sent successfully' });
          })
          .catch((error) => {

            console.log(error)
            res.status(500).send({ error: 'Error sending OTP' });
          });


       } catch (error) {
        return res.status(500).send({
            message:"Some internal server error",
            err:error
        })
       }
}


exports.validate=async(req,res)=>{
  console.log("map: ", map, details)

  try {

        const {mobile,otp}=req.body;
        if(!mobile){
            return res.status(400).send({
                message:"Please enter the mobile number"
            })
        }
        if(!otp){
            return res.status(400).send({
                message:"Please enter the OTP"
            })
        }
        let newOtp=map.get(mobile);
        console.log(newOtp, otp, newOtp==otp)
        if(newOtp==otp){
            try {
                const userSchema = new mongoose.Schema({
                  phoneNumber: { type: String, required: true },
                  ipInfo: { type: Object, required: true }, 
                });
        
                const User = mongoose.model('User', userSchema);
                const newUser = new User({
                  phoneNumber: mobile,
                  ipInfo: details.data, 
                });
        
                await newUser.save();
        
                map.delete(mobile);
                console.log('User registered successfully');
                res.status(200).send({ message: 'User registered successfully' });
              } catch (error) {
                console.error('Error registering user:', error);
                res.status(500).send({ error: 'Error registering user' });
              }
            } else {
              res.status(400).send({ error: 'Invalid OTP' });
            }
    } catch (error) {
      console.log(error)
        return res.status(500).send({
            message:"Some internal server error",
            err:error
        })
    }
}