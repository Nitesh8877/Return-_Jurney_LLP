const ipinfo = require('ipinfo');
const { details } = require('../utils');

const ipInfo=(req,res,next)=>{
    let ip=req.query.ip;
    if(!ip){
        return res.status(400).send({
            message:"Please enter your IP address"
        })
    }
    ipinfo(ip, (err, cLoc) => {
        if (err) {
          return res.status(403).send({
            message:"Error retrieving IP information"+err
          })
        }
    if (cLoc.country && cLoc.city ) {
          details.data=cLoc
          next();
        } else {
            res.status(200).send({
                message:"IP address is Invalid"
              })
        }
      });
}

module.exports={ipInfo}