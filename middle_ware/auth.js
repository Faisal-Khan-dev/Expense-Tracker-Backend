import jwt from 'jsonwebtoken'


export const auth = (req , res , next) => {
    try {
        
        const token = req.headers.authorization.split(" ")[1]
       console.log("token" , token);

        if (token) {
           
            const decoded = jwt.verify(token, "Batch14");
            req.user = decoded

           next()
       } else {
           return res.json({
               message: "unauth user!"
           })
       }

       
       
   } catch (error) {
        res.json({
            message: error.message || "Something went wrong!",
            status: false
        })
   }
}