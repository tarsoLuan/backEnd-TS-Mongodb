import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {User} from '../model/students'

class AuthenticationController {
    static async login(req:any, res:any) {
        try {
            console.log("req.body :>> ", req.body);
            const { email, password } = req.body
              
            const student = await User.findOne({ where: { email, isActive : true}})
            console.log("student :>> ", student?.dataValues.password);
            
            if (!student) {
              return res.status(401).json({ message: 'Usuário não existe ou desativado.' })
            }
            
            console.log(password)
            const compareResult = password === student?.dataValues.password;
    
            if (!compareResult) {
              return res.status(401).json({ message: 'Senha inválida' })
            }
    
            const token = jwt.sign({id:student.id, email:student.email}, 'secret_key')
    
            return res.status(200).json({auth:true, token: token, student: student})
            
		} catch (error) {
			console.error(error)
			res.status(500).json({ message: 'Server Error' })
		}
	}
    
	static async logout(req:any, res:any) {
		return res.json({auth:false, token: null})
	}
}

export default AuthenticationController