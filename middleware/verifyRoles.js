//accept any number of params
const verifyRoles = (...rolesArray) =>{
    return (req,res,next) =>{
        //unAuthorized
        console.log(req.roles);
        if(!req?.roles) return res.status(401).json({"message":"Unauthorized"});
     
        // console.log(rolesArray);
        console.log(req.roles);
        //compare role from jwt verify with allowed roles (predefined)
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

        //check if there is atleat one role
        if(!result) return res.status(401).json({"message":"Unauthorized"});
        next();
    }
} 

module.exports = verifyRoles;