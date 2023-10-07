import {Course} from '../model/courses'

const getCourses = async (req:any,res:any) => {
    try {
        const courses = await Course.findAll()
        res.json(courses)
    } catch (error) {
        console.error(error)
        res.status(500).send('Server Error')
    }
}

export default getCourses;