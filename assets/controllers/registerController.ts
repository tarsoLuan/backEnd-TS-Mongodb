import {User} from '../model/students'
import {Friend} from '../model/friends'

User.hasMany(Friend, {foreignKey: 'UserId', as: 'Friend'})
Friend.belongsTo(User, {foreignKey: 'FriendId', as: 'Friend'})
Friend.belongsTo(User, {foreignKey: 'UserId', as: 'User'})

const getStudents = async(req,res) => {
    try {
        const students = await User.findAll({where : {isActive : true}})
        res.json(students)
    } catch (e) {
        console.error(e)
        res.status(500).send('Server error')
    }
}

const getStudent = async(req,res) => {
    try {
        const userId = req.params.id
        const user = await User.findOne({where : {id : userId, isActive : true}})
        res.json(user)
    } catch (e) {
        console.error(e)
        res.status(500).send('Server error')
    }
}

const getFriends = async (req, res) => {
    const id = req.params.id;
    console.log('req.params -> ', req.params.id);
    console.log('id -> ', id);
    try {
        const friends = await Friend.findAll({
            where: {
                UserId: id,
            }
        });

        res.json(friends);
    } catch (e) {
        console.error(e);
        res.status(500).send('Server error');
    }
};

const addStudent = async(req,res) => {
    try{
        const { password, name, email} = req.body
        const [student, created] = await User.findOrCreate({
            where: {email : email},
            defaults: {
                password: password,
                name    : name,
                email   : email,
                isActive: true,
                username: email.split('@')[0]
            }
        })
        
        if (created) {
            res.json(student);

            const atendente = await User.findOne({where: {username: 'atendente'}})

            if (atendente) {
                const [friend, created] = await Friend.findOrCreate({
                    where: {
                        UserId: student.id!,
                        FriendId: atendente.id! ,
                    },
                    defaults: {
                        UserId: student.id!,
                        FriendId: atendente.id!,
                    },
                });

                const [friend2, created2] = await Friend.findOrCreate({
                    where: {
                        UserId: atendente.id!,
                        FriendId: student.id! ,
                    },
                    defaults: {
                        UserId: atendente.id!,
                        FriendId: student.id!,
                    },
                });
            }
        }
        else if(student) {
            if(student.isActive == false) {
                const oldStudent = await User.update({
                    isActive : true,
                    password: password,
                    name    : name,
                    email   : email
                },
                    {where: {
                        email : email}
                        , individualHooks: true
                    }
                )
                res.json(oldStudent)
            } else {
                throw new Error('Este usuário já existe')
            } 
        }
        
        
    } catch(e){
        console.error(e)
        res.status(500).send(e.message)
    }
}

const updateStudent = async(req,res) => {
    try {
        const userId = req.params.id
        const {email, password, name, phone} = req.body
        const student = await User.update({
            email,
            password,
            name
            }, {where: {id : userId}, individualHooks: true},)
        res.json(student)
    } catch(e){
        console.error(e)
        res.status(500).send(e.message)
    }
}

const deleteStudents = async(req,res) => {
    try {
        const userId = req.params.id
        
        User.update({isActive : false},{where : {id : userId}})
        res.json({message: 'ok'})
    } catch(e){
        console.error(e)
        res.status(500).send(e.message)
    }
}

export default  {getStudent, addStudent, updateStudent, deleteStudents, getFriends, getStudents}