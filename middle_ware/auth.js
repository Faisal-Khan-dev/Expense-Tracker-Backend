import jwt from 'jsonwebtoken'


export const auth = (req , res , next) => {
    try {
        
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader) {
            return res.json({ message: "Token missing!" });
        }
        const token = authHeader.split(" ")[1];

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