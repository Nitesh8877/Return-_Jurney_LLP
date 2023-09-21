const { ipInfo } = require("../middleware/ipinfo")
const {sendOtp,validate}=require('../controller/user.controller')

module.exports=function(app){
    app.post("/otp", ipInfo, sendOtp);
    app.post("/validate", validate);
}