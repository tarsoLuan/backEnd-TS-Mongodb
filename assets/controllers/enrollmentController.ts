import { where } from 'sequelize'
import {Enrollment} from '../model/enrollment'
import {Course} from '../model/courses'
import {User} from '../model/students'
import util from 'util'

Enrollment.belongsTo(Course, {foreignKey: 'CourseId'})
Enrollment.belongsTo(User, {foreignKey: 'UserId'})

class RouteError extends Error {
    error: string;
    statusCode: number;
    constructor(msg:string, statusCode = 500) {
        super(msg);

        this.error = msg;
        this.statusCode = statusCode;
    }
}

const getEnrollment = async (req,res)=>{
    try {
        const userId = req.params.userId
        const enrollments = await Enrollment.findAll({include: [{model: Course}],where: {UserId : userId}})
        res.json(enrollments)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
}

const addEnrollment = async (req,res)=>{
    try {
        const studentId = req.params.userId
        const courseId = req.body.id

        const [enrollment, created] = await Enrollment.findOrCreate({
            where: {UserId : studentId, CourseId : courseId}
        })
        if(created) {

            const course = await Course.findByPk(courseId)
    
            if (!course) {
                throw new RouteError('Curso não encontrado.', 404)
            }
        
            if (course.remainingVacancies === 0) {
                throw new RouteError('Não existem mais vagas disponíveis para este curso.', 400)
            }
        
            course.decrement('remainingVacancies')
            await course.save()

            res.json(enrollment)
        } 
        else {
            throw new RouteError('Você já está registrado neste curso', 500)
        }       
    } catch (error) {
        console.log(error)
        res.status(error.statusCode).send(error.error)
    }  
}

const removeEnrollment = async (req,res)=>{
    try {
        const enrollmentId = req.body.id
        const courseId = req.body.CourseId

        console.log('courseId ->' + courseId)

        console.log(`post/${util.inspect(req.body,false,null)}`);
        console.log('enrollmentId ->' + enrollmentId);
        console.log('courseId ->' + courseId);

        Enrollment.destroy({where : {id : enrollmentId}})

        const course = await Course.findByPk(courseId)

        if (!course) {
            throw new RouteError('Curso não encontrado.', 404)
        }
    
        course.increment('remainingVacancies')
        await course.save()

        res.json({message: 'ok'})
      
    } catch (error) {
        console.log(error)
        res.status(error.statusCode).send(error.error)
    }  
}

export default {getEnrollment, addEnrollment, removeEnrollment}