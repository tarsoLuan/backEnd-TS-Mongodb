import express from 'express';
import path from 'path'
import registerController from '../controllers/registerController.js'
import AuthenticationController from '../controllers/authController.js'
import ChatController  from '../controllers/chatController';

const router = express.Router()


router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../register.html'))
})

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../main.html'))
})

router.post('/predict', async (req,res) => {
    try {
        const result = await new ChatController().predict(req.body.message);
        
        console.log('Resultado da Predição:', result);
        res.json({ result });
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).json({ error: 'Erro interno ao processar a solicitação' });
    }
});

router.post('/signin',AuthenticationController.login) //ok
router.get('/signout',AuthenticationController.logout) // ok
router.get('/getStudents', registerController.getStudents) //ok
router.get('/getStudent/:id', registerController.getStudent) //ok
router.post('/register/add', registerController.addStudent); //ok
router.put('/updateStudent/:id', registerController.updateStudent)
router.delete('/deleteStudents/:id', registerController.deleteStudents)


export default router;