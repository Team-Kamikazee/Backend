import User from '../models/userModel'
export const GetAllUsers = async(req,res) => {
    try{
        const users = await User.find({})

        if(users.length === 0) {
            res.status(404).json({
                message: 'Not Todos Found, Add some',
                
            })
        }

        res.status(200).json({
            message:'success',
            users
        })

    }catch(err){
        console.log(err)
    }
}