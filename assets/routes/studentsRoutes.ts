import express from 'express';
import path from 'path'
import studentsController from '../controllers/studentsInfoController.js'
import enrollmentController from '../controllers/enrollmentController.js'

const router = express.Router()


// const registerController   = require('../controllers/registerController.js')

router.get('/', (req:any, res:any) => {
    res.sendFile(path.join(__dirname, '../../studentsInfo.html'))
})

router.get('/getCourses',studentsController); //ok
router.get('/getEnrollment/:userId', enrollmentController.getEnrollment) //ok
router.post('/addEnrollment/:userId', enrollmentController.addEnrollment) //ok
router.post('/removeEnrollment', enrollmentController.removeEnrollment) 

export default router;