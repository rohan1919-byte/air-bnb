// utils folder means utility tyat error class vagere extra chije  folder tyat wrapAsync function banavnar yat  

module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};